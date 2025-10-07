// UserProfile.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const user = useSelector((state) => state.posts.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    user_name: user?.user_name || "",
    mail: user?.mail || "",
    password: "",
    profilePic: user?.profilePic || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-[#f0f0f0]">
        <h2 className="text-xl font-bold">No hay usuario logueado</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const dataToSend = { ...formData };
      if (dataToSend.password.trim() === "") delete dataToSend.password;
      const response = await axios.put(`/users/${user.user_id}`, dataToSend);
      
      const data = response.data;
      setMessage("Perfil actualizado correctamente ✅");
      setEditMode(false);

      // Actualizar el usuario en el store de Redux
      dispatch({ type: "UPDATE_USER", payload: data });

    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      const errorMsg = err.response?.data?.error || err.message;
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6">Mi perfil personal</h1>

        {editMode ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block font-semibold">Nombre de usuario</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold">Correo electrónico</label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block font-semibold">Nueva contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                placeholder="Dejar vacío para no cambiar"
              />
            </div>

            <div>
              <label className="block font-semibold">Foto de perfil (URL)</label>
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition w-full"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-500 transition w-full"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-4">
              <span className="font-semibold">Nombre:</span> {user.user_name}
            </div>

            <div className="mb-4">
              <span className="font-semibold">Correo:</span> {user.mail}
            </div>

            <div className="mb-4">
              <span className="font-semibold">Premium:</span>{" "}
              {user.roles?.premium ? "Activo" : "Inactivo"}
            </div>

            <div className="mb-6">
              <span className="font-semibold">Editor:</span>{" "}
              {user.roles?.editor ? "Activo" : "Inactivo"}
            </div>

            {user.profilePic && (
              <div className="mb-6 flex justify-center">
                <img
                  src={user.profilePic}
                  alt="Foto de perfil"
                  className="w-32 h-32 object-cover rounded-full shadow"
                />
              </div>
            )}

            <Link
              onClick={() => setEditMode(true)}
              className="block w-full text-center bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition mb-3"
            >
              Editar perfil
            </Link>

            <Link
              to="/Administration"
              className="block w-full text-center bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition mb-3"
            >
              Admin Panel
            </Link>

            <Link
              to="/home"
              className="block w-full text-center bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
            >
              Salir
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

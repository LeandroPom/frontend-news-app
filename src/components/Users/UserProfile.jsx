// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const UserProfile = () => {
  const user = useSelector((state) => state.posts.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    user_name: user?.user_name || "",
    mail: user?.mail || "",
    password: "",
    profilePic: user?.profilePic || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 👉 Premium data desde el backend (/premiums/all)
  const [premiumData, setPremiumData] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-[#f0f0f0]">
        <h2 className="text-xl font-bold">No hay usuario logueado</h2>
      </div>
    );
  }

  // Traer premium del usuario
  useEffect(() => {
    const fetchPremium = async () => {
      if (!user?.user_id) return;

      try {
        const res = await fetch("http://localhost:3001/premiums/all");
        const all = await res.json();

        const userPremium = all.find((p) => p.user_id === user.user_id);

        setPremiumData(userPremium || null);
      } catch (error) {
        console.error("Error obteniendo premium:", error);
      }
    };

    fetchPremium();
  }, [user]);

  // Handler para renovar
  // const handleRenewPremium = async () => {
  //   try {
  //     const res = await fetch("http://localhost:3001/premiums/", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user_id: user.user_id,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (data.message === "Debes esperar a que tu Premium esté por vencer para renovar") {
  //       alert(data.message);
  //       return;
  //     }

  //     if (!data.init_point) {
  //       alert("Error: backend no devolvió init_point");
  //       return;
  //     }

  //     window.location.href = data.init_point;
  //   } catch (error) {
  //     console.error("Error renovando premium:", error);
  //     alert("Error procesando la renovación");
  //   }
  // };

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
    <div className="min-h-screen bg-[#f9f9f9] p-6 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Mi perfil personal</h1>

        {editMode ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block font-semibold">Nombre de usuario</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-[#0C2342]"
              />
            </div>

            <div>
              <label className="block font-semibold">Correo electrónico</label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-[#0C2342]"
              />
            </div>

            <div>
              <label className="block font-semibold">Nueva contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-[#0C2342]"
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
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-[#0C2342]"
              />
            </div>

            {message && (
              <p
                className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"
                  }`}
              >
                {message}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`primary w-full text-white font-semibold py-2 px-4 rounded transition
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#1B4A8A]"}`}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="secondary w-full font-semibold py-2 px-4 rounded transition hover:bg-[#ADC8E6] hover:text-[#0C2342]"
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

            {/* 🔥 PREMIUM REAL DESDE BACKEND */}
            <div className="mb-4">
              <span className="font-semibold">Premium:</span>{" "}
              {premiumData ? (
                <div className="flex flex-col mt-1">
                  <span className="text-green-600 font-bold">Activo ✔</span>
                  <span className="text-sm text-gray-700">
                    Vence el: <strong>
                      {new Date(premiumData.expiration_date).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </strong>

                    <div className="mb-6">
                      <span className="font-semibold">Editor:</span>{" "}
                      <span
                        className={`font-bold ${user.roles?.editor ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {user.roles?.editor ? "Activo ✔" : "Inactivo ✖"}
                      </span>
                    </div>

                  </span>
                  <button
                    onClick={() => navigate("/Premium")}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Renovar
                  </button>
                </div>
              ) : (
                <span className="text-red-600 font-bold">Inactivo ✖</span>
              )}
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

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setEditMode(true)}
                className="primary w-medium font-semibold py-2 rounded-lg hover:bg-[#1B4A8A] hover:text-white transition"
              >
                Editar perfil
              </button>

              {user.roles?.admin && (
                <button
                  onClick={() => navigate("/Administration")}
                  className="secondary w-medium font-semibold py-2 rounded-lg hover:bg-[#ADC8E6] hover:text-[#0C2342] transition"
                >
                  Admin Panel
                </button>
              )}

              {(user.roles?.admin || user.roles?.editor) && (
                <button
                  onClick={() => navigate("/Administration/postpanel")}
                  className="secondary w-medium font-semibold py-2 rounded-lg hover:bg-[#ADC8E6] hover:text-[#0C2342] transition"
                >
                  Mis Publicaciones
                </button>
              )}

              <button
                onClick={() => navigate("/mis-favoritos")}
                className="secondary w-medium font-semibold py-2 rounded-lg hover:bg-yellow-200 hover:text-[#0C2342] transition"
              >
                ❤️ Mis Favoritos
              </button>

              <button
                onClick={() => navigate("/home")}
                className="pagina w-medium font-semibold py-2 rounded-lg hover:bg-[#1B4A8A] hover:text-white transition"
              >
                Salir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

// UserProfile.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserProfile = () => {
  // Tomamos el usuario del state
  const user = useSelector((state) => state.posts.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-[#f0f0f0]">
        <h2 className="text-xl font-bold">No hay usuario logueado</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black">Mi perfil personal</h1>

        <div className="mb-4 text-black">
          <span className="font-semibold">Nombre:</span> {user.user_name}
        </div>

        <div className="mb-4 text-black">
          <span className="font-semibold">Correo:</span> {user.mail}
        </div>

        <div className="mb-4 text-black">
          <span className="font-semibold">Premium:</span>{" "}
          {user.roles?.premium ? "Activo" : "Inactivo"}
        </div>

        <div className="mb-6 text-black">
          <span className="font-semibold">Editor:</span>{" "}
          {user.roles?.editor ? "Activo" : "Inactivo"}
        </div>

        {/* 🔹 Botón Admin Panel */}
        <Link
          to="/Administration"
          className="block w-full text-center bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition mb-3"
        >
          Admin Panel
        </Link>

        {/* 🔹 Botón Salir */}
        <Link
          to="/home"
          className="block w-full text-center bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
        >
          Salir
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;

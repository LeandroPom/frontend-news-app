// AdminPanel.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-black">Admin Panel</h1>

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4">
        {/* Botón Crear Post */}
        <Link
          to="/create"
          className="block text-center bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Crear Post
        </Link>

        {/* Botón Crear Tag */}
        <Link
          to="/creartag"
          className="block text-center bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition"
        >
          Crear Tag
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;

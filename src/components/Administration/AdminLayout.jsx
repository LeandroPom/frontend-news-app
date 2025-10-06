// AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const linkClasses =
    "block bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-xl hover:bg-gray-100 transition-all duration-200";

  return (
    <div className="min-h-screen flex bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-black mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-4">
          <Link to="create" className={linkClasses}>
            Crear Post
          </Link>
          <Link to="creartag" className={linkClasses}>
            Crear Tag
          </Link>
          <Link to="banner" className={linkClasses}>
            Crear Banner
          </Link>
           <Link to="userpanel" className={linkClasses}>
            Panel de usuarios
          </Link>
           <Link to="postpanel" className={linkClasses}>
            Panel de Posts
          </Link>
          <Link to="/home" className={linkClasses + " mt-6"}>
            Salir
          </Link>
        </nav>
      </aside>

      {/* Contenido dinámico */}
      <main className="flex-1 p-10">
        <Outlet /> {/* Aquí se cargan las rutas hijas */}
      </main>
    </div>
  );
};

export default AdminLayout;

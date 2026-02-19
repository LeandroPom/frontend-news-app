import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const user = useSelector((state) => state.posts.user);
  const navigate = useNavigate();

  const linkClasses =
    "block text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 hover:bg-[#E2E8F0]";

  const isAdmin = user?.roles?.admin;
  const isEditor = user?.roles?.editor;

  // 🧠 Redirección automática si el usuario no es admin ni editor
  useEffect(() => {
    if (!user) {
      navigate("/home"); // no logueado
    } else if (!isAdmin && !isEditor) {
      navigate("/home"); // premium o usuario normal
    }
  }, [user, isAdmin, isEditor, navigate]);

  // Mientras se evalúa el usuario, no renderiza nada (evita parpadeos)
  if (!user || (!isAdmin && !isEditor)) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-black mb-6">
          {isAdmin ? "Panel de Administración" : "Panel del Editor"}
        </h1>

        <nav className="flex flex-col gap-4">
          {/* Crear Post → visible para admin y editor */}
          {(isAdmin || isEditor) && (
            <Link to="create" className={linkClasses}>
              Crear Post
            </Link>
          )}

          {/* Crear Tag → solo admin */}
          {isAdmin && (
            <Link to="creartag" className={linkClasses}>
              Crear Tag
            </Link>
          )}

          {/* Crear Banner → solo admin */}
          {isAdmin && (
            <Link to="banner" className={linkClasses}>
              Crear Banner
            </Link>
          )}

          {/* Panel de usuarios → solo admin */}
          {isAdmin && (
            <Link to="userpanel" className={linkClasses}>
              Panel de Usuarios
            </Link>
          )}

          {/* Panel de Posts → visible para admin y editor */}
          {(isAdmin || isEditor) && (
            <Link to="postpanel" className={linkClasses}>
              Panel de Posts
            </Link>
          )}

          {/* Panel de Productos → solo admin */}
          {isAdmin && (
            <Link to="productpanel" className={linkClasses}>
              Panel de Productos
            </Link>
          )}

          {/* Salir */}
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

// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/postsActions";
import { FaUserCircle } from "react-icons/fa"; // icono de usuario

function Navbar() {
  const dispatch = useDispatch();

  // ✅ Tomamos el usuario del state
  const user = useSelector((state) => state.posts.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      className="text-white shadow-md backdrop-blur-md"
      style={{
        backgroundColor: "rgba(18, 51, 95, 0.6)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Título */}
          <div className="flex-shrink-0">
            <Link to="/home">
              <h1 className="text-xl font-bold hover:text-blue-600 transition">
                Palabra Argentina
              </h1>
            </Link>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {!user ? (
              <Link
                to="/login"
                className="hover:text-red-500 transition-colors"
              >
                Acceder
              </Link>
            ) : (
              <>
                {/* Icono y link a MiPerfil */}
                <div className="flex items-center space-x-2">
                  <FaUserCircle size={24} />
                  <Link
                    to="/Miperfil"
                    className="hover:text-blue-500 transition font-medium"
                  >
                    MiPerfil
                  </Link>
                </div>

                {/* Botón logout */}
                <button
                  onClick={handleLogout}
                  className="hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            <a href="#" className="hover:text-red-500 transition-colors">Noticias recientes</a>
            <a href="#" className="hover:text-red-500 transition-colors">Información</a>
            <a href="#" className="hover:text-red-500 transition-colors">Noticias locales</a>
            <a href="#" className="hover:text-red-500 transition-colors">Noticias mundiales</a>
            <a href="#" className="hover:text-red-500 transition-colors">Contáctanos</a>
          </div>

          {/* Botón móvil (hamburguesa) */}
          <div className="md:hidden">
            <button className="focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

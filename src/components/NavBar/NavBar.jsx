// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="text-white shadow-md backdrop-blur-md"
      style={{
        backgroundColor: "rgba(18, 51, 95, 0.6)", // color #12335F con 60% de opacidad
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Título */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Palabra Argentina</h1>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-6">
             <Link
              to="/login"
              className="hover:text-red-500 transition-colors"
            >
              Acceder
            </Link>
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

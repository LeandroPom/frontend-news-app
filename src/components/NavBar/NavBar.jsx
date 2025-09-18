// Navbar.jsx
import React from "react";

  function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Título */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Portal de noticias</h1>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-red-500 transition-colors">Acceder</a>
            <a href="#" className="hover:text-red-500 transition-colors">Noticias recientes</a>
            <a href="#" className="hover:text-red-500 transition-colors">Información</a>
            <a href="#" className="hover:text-red-500 transition-colors">Noticias locales</a>
            <a href="#" className="hover:text-red-500 transition-colors">Noticias mundiales</a>
            <a href="#" className="hover:text-red-500 transition-colors">Contáctanos</a>
          </div>

          {/* Botón móvil (hamburguesa) */}
          <div className="md:hidden">
            {/* Aquí podrías agregar un botón de menú para mobile si querés */}
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
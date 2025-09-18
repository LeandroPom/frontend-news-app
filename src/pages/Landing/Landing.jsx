// Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';

  function Landing() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
        {/* Título */}
        <h1 className="text-5xl font-extrabold mb-6">
          Portal de Noticias
        </h1>

        {/* Subtítulo */}
        <p className="text-lg mb-8 text-gray-200">
          Mantente informado con las últimas noticias locales, nacionales e internacionales
        </p>

        {/* Botón Enter */}
        <Link to="/home">
          <button className="px-8 py-3 bg-red-600 hover:bg-red-500 transition-colors rounded-lg text-white font-semibold text-lg shadow-lg">
            Enter
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
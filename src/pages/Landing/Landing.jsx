import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white space-y-12">
      
      {/* Título con animación de gradiente */}
      <h1
        className="text-6xl font-extrabold 
                   bg-gradient-to-r from-red-700 via-red-400 to-red-700 
                   bg-[length:200%_200%] bg-clip-text text-transparent
                   drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)]
                   animate-shine"
      >
        Palabra Argentina
      </h1>

      {/* Botón Enter */}
      <Link to="/home">
        <button className="px-8 py-3 bg-red-600 hover:bg-red-500 transition-colors rounded-lg text-white font-semibold text-lg shadow-lg">
          Enter
        </button>
      </Link>
    </div>
  );
}

export default Landing;

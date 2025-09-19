// Post.jsx
import React from "react";
import Navbar from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";

function Post() {
  // Por ahora está fijo en la noticia 1
  const noticia = {
    id: 1,
    title: "River Plate cae ante Palmeiras en la Copa Libertadores",
    date: "19 de Septiembre de 2025",
    views: 1200,
    image: "https://futbolete.com/wp-content/uploads/2025/09/donde-ver-river-plate-palmeiras-libertadores-tv-online.jpg",
    content: `En la ida de los cuartos de final de la Copa Libertadores, 
    River Plate perdió 2-1 contra Palmeiras en el Estadio Monumental. 
    El equipo argentino no logró sostener la ventaja inicial y ahora 
    deberá buscar revertir el resultado en Brasil el próximo miércoles 
    para avanzar a las semifinales.`
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#12335F" }}>
      {/* Navbar */}
      <Navbar />

      <div
        className="max-w-3xl mx-auto mt-8 p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: "rgba(12, 35, 66, 0.4)", // efecto semitransparente tipo navbar
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Título */}
        <h1 className="text-3xl font-bold text-white mb-2">
          {noticia.title}
        </h1>

        {/* Fecha y vistas */}
        <p className="text-sm text-gray-300 mb-4">
          📅 {noticia.date} • 👁️ {noticia.views} vistas
        </p>

        {/* Imagen */}
        <img
          src={noticia.image}
          alt={noticia.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        {/* Contenido */}
        <p className="text-white leading-relaxed mb-6">
          {noticia.content}
        </p>

        {/* Volver */}
        <Link
          to="/Home"
          className="inline-block text-accent hover:text-accentLight font-medium"
        >
          ← Volver a las noticias
        </Link>
      </div>
    </div>
  );
}

export default Post;

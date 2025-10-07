import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const noticiasData = [
  {
    id: 1,
    title: "Video de tecnología",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Noticia deportiva",
    youtubeUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
  },
  {
    id: 3,
    title: "Entretenimiento",
    youtubeUrl: "https://www.youtube.com/embed/J---aiyznGQ",
  },
];

const Noticias = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (videoUrl) {
      timer = setTimeout(() => {
        setVideoUrl(null); // cerrar modal
        navigate("/home");  // redirigir a home
      }, 10000); // 10 segundos
    }
    return () => clearTimeout(timer);
  }, [videoUrl, navigate]);

  const handleClick = (url) => {
    setVideoUrl(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Noticias</h1>
      <ul className="space-y-4">
        {noticiasData.map((noticia) => (
          <li
            key={noticia.id}
            onClick={() => handleClick(noticia.youtubeUrl)}
            className="cursor-pointer p-4 bg-white shadow rounded hover:bg-gray-100 transition text-black"
          >
            {noticia.title}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <iframe
            title="Video"
            width="800"
            height="450"
            src={`${videoUrl}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Noticias;

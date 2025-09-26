// SidebarPublicidad.jsx
import React, { useState, useEffect } from "react";

const banners = [
  {
    src: "https://tse4.mm.bing.net/th/id/OIP.r7A1PxAn8GTBZwTFIXZgWQHaEK?pid=Api&P=0&h=180",
    alt: "Nissan",
    title: "Concesionaria Nissan",
  },
  {
    src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218fHxmb29kfHx8fHx8MTY5NTI5MDQyNA&ixlib=rb-4.0.3&q=80&w=400",
    alt: "Comida",
    title: "Recetas y Comida",
  },
];

const SidebarPublicidad = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-end gap-4 mt-4 lg:mt-0">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`rounded shadow overflow-hidden transition-opacity duration-500 absolute`}
          style={{
            right: 0, // pegado a la orilla
            width: "20%", // mitad del ancho del sidebar
            height: "100%", // más alto que antes
            opacity: index === current ? 1 : 0, // aparece solo el actual
          }}
        >
          <img
            src={banner.src}
            alt={banner.alt}
            className="w-full h-full object-cover"
          />
          <div className="p-1 font-semibold text-center text-black text-sm">
            {banner.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarPublicidad;

// SidebarPublicidad.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SidebarPublicidad = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  // Cargar banners activos desde el backend
  const fetchBanners = async () => {
    try {
      const res = await axios.get("/banners");
      // solo banners activos
      const activeBanners = res.data.filter(b => b.active);
      setBanners(activeBanners);
    } catch (err) {
      console.error("Error al cargar banners", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Rotar banners
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 3000); // cada 3 segundos
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
   <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded shadow">
      {banners.map((banner, index) => (
       <div
    key={`${banner.id || index}-${index}`}
    className={`absolute inset-0 transition-opacity duration-700
    ${index === current ? "opacity-100" : "opacity-0"}`}
  >
          <img
            src={banner.img[0]}
            alt={banner.banner_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full bg-white bg-opacity-70 text-center text-sm font-semibold text-black py-1">
            {banner.banner_name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarPublicidad;

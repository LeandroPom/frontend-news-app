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
    <div className="w-full flex flex-col items-end gap-4 mt-4 lg:mt-0 relative h-60">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className="rounded shadow overflow-hidden transition-opacity duration-500 absolute"
          style={{
            right: 0,
            width: "60%",
            height: "150%",
            opacity: index === current ? 1 : 0,
          }}
        >
          <img
            src={banner.img[0]} // asumimos que siempre hay al menos 1 imagen
            alt={banner.banner_name}
            className="w-full h-full object-cover"
          />
          <div className="p-1 font-semibold text-center text-black text-sm bg-white bg-opacity-70">
            {banner.banner_name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarPublicidad;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Carousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Traer banners del backend y filtrar priority: true
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/banners');
        const priorityBanners = response.data.filter(b => b.priority);
console.log(response.data);
        setBanners(priorityBanners);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // Autoplay cada 15s si hay más de un banner
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(goToNext, 15000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, banners]);

  if (banners.length === 0) return null;

  const isSingle = banners.length === 1;

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 z-10">
      {/* Contenedor de imágenes */}
     <div className="relative w-full h-60 overflow-hidden bg-gray-100" style={{ top: '65px' }}>
  {banners.map((banner, index) => (
    <img
      key={banner.banner_id}
      src={banner.img[0] || '/placeholder.jpg'}
      alt={banner.banner_name}
      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    />
  ))}
</div>

      {/* Botón anterior */}
      <button
        onClick={goToPrevious}
        disabled={isSingle}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed z-20"
      >
        &#8249;
      </button>

      {/* Botón siguiente */}
      <button
        onClick={goToNext}
        disabled={isSingle}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed z-20"
      >
        &#8250;
      </button>
    </div>
  );
};

export default Carousel;

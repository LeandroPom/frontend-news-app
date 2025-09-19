import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ items }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full mt-4">
      {/* Contenedor principal */}
      <div className="w-ffull h-[100px] overflow-hidden rounded-xl shadow-lg relative bg-black">
        {items.map((src, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-500 ease-in-out ${
              index === current ? "block" : "hidden"
            }`}
          >
            <img
              src={src}
              alt={`slide-${index}`}
              className="w-full h-[100px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Carousel;

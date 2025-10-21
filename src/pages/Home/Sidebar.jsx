import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { name: "Inicio", path: "/" },
    { name: "Noticias", path: "/noticias" },
    { name: "Generales", path: "/generales" },
    { name: "Locales", path: "/locales" },
    { name: "Deportes", path: "/deportes" },
    { name: "Política", path: "/politica" },
    { name: "Espectáculos", path: "/espectaculos" },
    { name: "Tecnología", path: "/tecnologia" },
    { name: "Busqueda Avanzada", path: "/Busqueda" },
  ];

  return (
    <>
      {/* 🔘 Botón solapa lateral (siempre visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 bg-black border border-white shadow-md p-2 rounded-r-lg transition-all duration-300`}
      >
        {isOpen ? (
          <FaChevronLeft className="text-white" />
        ) : (
          <FaChevronRight className="text-white" />
        )}
      </button>

      {/* 🧭 Sidebar */}
      <div
        className={`fixed top-14 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 flex flex-col
        ${isOpen ? "translate-x-0 w-64 opacity-100" : "-translate-x-full w-64 opacity-0"}`}
      >
        {/* Encabezado */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-black">Menú</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-black transition"
          >
            <FaChevronLeft size={18} />
          </button>
        </div>

        {/* Lista de secciones */}
        <ul className="flex-1 overflow-y-auto p-4 space-y-2">
          {sections.map((section) => (
            <li key={section.name}>
              <Link
                to={section.path}
                className="block px-2 py-2 rounded-md text-black font-medium hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
              >
                {section.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Fondo oscuro en móviles y escritorio cuando el menú está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

// Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // usando react-icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

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
    <div
      className={`sticky top-[80px] left-0 bg-white shadow-lg rounded-md transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header con botón */}
      <div className="flex items-center justify-between p-3 border-b">
        {/* El texto solo se oculta visualmente, no colapsa el botón */}
        {isOpen && (
          <h3 className="text-lg font-bold text-black">Secciones</h3>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-black transition ml-auto"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Lista de secciones */}
      {isOpen && (
        <ul className="space-y-2 p-3">
          {sections.map((section) => (
            <li key={section.name}>
              <Link
                to={section.path}
                className="block px-2 py-1 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                {section.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

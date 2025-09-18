// Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { FaNewspaper, FaGlobe, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mock data de ejemplo con contenido más largo
const mockPosts = [
  {
    id: 1,
    title: "Noticia 1",
    views: 1200,
    summary: "River Plate cae ante Palmeiras en la Copa Libertadores clickea en ver mas",
    content: "En la ida de los cuartos de final de la Copa Libertadores, River Plate perdió 2-1 contra Palmeiras en el Monumental. El equipo argentino buscará revertir el resultado en Brasil el próximo miércoles para avanzar a las semifinales"
  },
  {
    id: 2,
    title: "Noticia 2",
    views: 980,
    summary: "Argentina avanza a octavos en el Mundial de Vóley tras vencer a Francia clickea en ver mas.",
    content: "La selección argentina de vóley, dirigida por Marcelo Méndez, derrotó a Francia en un partido agónico que se resolvió en el quinto set. Con esta victoria, el equipo nacional se clasificó a los octavos de final del Mundial de Vóley 2025"
  },
  {
    id: 3,
    title: "Noticia 3",
    views: 450,
    summary: "Encuesta revela aumento en la desaprobación de Javier Milei clickea en ver mas.",
    content: "Una encuesta de AtlasIntel indica que la desaprobación del presidente argentino Javier Milei alcanzó un récord en septiembre, marcando el tercer mes consecutivo de caída en su imagen pública. El índice de desaprobación subió al 52,3%"
  },
  {
    id: 4,
    title: "Noticia 4",
    views: 2100,
    summary: "Diputados rechaza vetos a ley del Garrahan y fondos universitarios clickea en ver mas.",
    content: "La Cámara de Diputados de Argentina rechazó por amplia mayoría los vetos del presidente Javier Milei a la ley del Hospital Garrahan y a los fondos destinados a universidades nacionales. La decisión fue celebrada por la comunidad educativa y generó tensiones dentro del oficialismo"
  },
];

  function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({}); // controla qué posts están expandidos

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllPosts(mockPosts);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const togglePost = (id) => {
    setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex mt-4">
        {/* Sidebar */}
        <div className={`bg-white shadow-md rounded-r-lg transition-all duration-300
                        ${sidebarOpen ? 'w-64' : 'w-16'} overflow-hidden relative`}>
          {/* Toggle button dentro del sidebar */}
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center mt-4 ml-4 px-2 py-1 bg-gray-900 text-white rounded-md shadow-md focus:outline-none"
          >
            {sidebarOpen ? <FaChevronLeft className="mr-2" /> : <FaChevronRight className="mr-2" />}
            <span className="text-sm font-medium">{sidebarOpen ? 'Ocultar' : ''}</span>
          </button>

          <ul className="mt-8 flex flex-col">
            <li className="flex items-center px-4 py-3 hover:bg-gray-200 cursor-pointer">
              <FaNewspaper className="mr-3" />
              {sidebarOpen && <span>Noticias recientes</span>}
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-gray-200 cursor-pointer">
              <FaGlobe className="mr-3" />
              {sidebarOpen && <span>Generales</span>}
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-gray-200 cursor-pointer">
              <FaMapMarkerAlt className="mr-3" />
              {sidebarOpen && <span>Actuales</span>}
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-gray-200 cursor-pointer">
              <FaMapMarkerAlt className="mr-3" />
              {sidebarOpen && <span>Nacionales</span>}
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-gray-200 cursor-pointer">
              <FaMapMarkerAlt className="mr-3" />
              {sidebarOpen && <span>Locales</span>}
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-red-600 inline-block mb-8">
            📰 Publicaciones más vistas
          </h1>

          <ul className="space-y-6">
            {allPosts.map(post => (
              <li
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 hover:text-red-600 cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">👁️ {post.views} vistas</p>

                {/* Resumen / contenido */}
                <p className="text-gray-700 leading-relaxed mb-2">
                  {expandedPosts[post.id] ? post.content : post.summary}
                </p>

                {/* Botón ver más */}
                <button
                  onClick={() => togglePost(post.id)}
                  className="flex items-center text-red-600 hover:text-red-500 font-medium focus:outline-none"
                >
                  {expandedPosts[post.id] ? 'Ver menos' : 'Ver más'}
                  <span className="ml-1">{expandedPosts[post.id] ? '▲' : '▼'}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
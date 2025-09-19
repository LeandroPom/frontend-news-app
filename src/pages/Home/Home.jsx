import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { useNavigate } from "react-router-dom";
import { 
  FaNewspaper, FaGlobe, FaMapMarkerAlt, 
  FaChevronLeft, FaChevronRight, 
  FaThumbsUp, FaHeart 
} from 'react-icons/fa';
import Carousel from "../../pages/Carrousel/Carrousel";

const carouselItems = [
  "https://img.odcdn.com.br/wp-content/uploads/2025/01/nissan-1920x1080.jpg",
];

const mockPosts = [
  {
    id: 1,
    title: "Deportes",
    views: 1200,
    summary: "River Plate cae ante Palmeiras en la Copa Libertadores clickea en ver mas",
    content: "En la ida de los cuartos de final de la Copa Libertadores, River Plate perdió 2-1 contra Palmeiras en el Monumental. El equipo argentino buscará revertir el resultado en Brasil el próximo miércoles para avanzar a las semifinales"
  },
  {
    id: 2,
    title: "Deportes",
    views: 980,
    summary: "Argentina avanza a octavos en el Mundial de Vóley tras vencer a Francia clickea en ver mas.",
    content: "La selección argentina de vóley, dirigida por Marcelo Méndez, derrotó a Francia en un partido agónico que se resolvió en el quinto set. Con esta victoria, el equipo nacional se clasificó a los octavos de final del Mundial de Vóley 2025"
  },
  {
    id: 3,
    title: "Politica",
    views: 450,
    summary: "Encuesta revela aumento en la desaprobación de Javier Milei clickea en ver mas.",
    content: "Una encuesta de AtlasIntel indica que la desaprobación del presidente argentino Javier Milei alcanzó un récord en septiembre, marcando el tercer mes consecutivo de caída en su imagen pública. El índice de desaprobación subió al 52,3%"
  },
  {
    id: 4,
    title: "Politica",
    views: 2100,
    summary: "Diputados rechaza vetos a ley del Garrahan y fondos universitarios clickea en ver mas.",
    content: "La Cámara de Diputados de Argentina rechazó por amplia mayoría los vetos del presidente Javier Milei a la ley del Hospital Garrahan y a los fondos destinados a universidades nacionales. La decisión fue celebrada por la comunidad educativa y generó tensiones dentro del oficialismo"
  },
];

function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const navigate = useNavigate();

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
  <div className="min-h-screen" style={{ backgroundColor: '#12335F' }}>
    {/* Navbar */}
    <Navbar />

    {/* Carousel */}
    <Carousel items={carouselItems} />

    <div className="flex mt-4 flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`text-white shadow-md rounded-r-lg transition-all duration-300
                    ${sidebarOpen ? 'w-64' : 'w-16'} overflow-hidden relative`}
        style={{ backgroundColor: '#0C2342' }}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center mt-4 ml-4 px-2 py-1 rounded-md shadow-md focus:outline-none"
          style={{ backgroundColor: '#12335F', color: '#ffffff' }}
        >
          {sidebarOpen ? <FaChevronLeft className="mr-2" /> : <FaChevronRight className="mr-2" />}
          <span className="text-sm font-medium">{sidebarOpen ? 'Ocultar' : ''}</span>
        </button>

        <ul className="mt-8 flex flex-col">
          {[
            { icon: <FaNewspaper />, label: 'Noticias recientes' },
            { icon: <FaGlobe />, label: 'Generales' },
            { icon: <FaMapMarkerAlt />, label: 'Actuales' },
            { icon: <FaMapMarkerAlt />, label: 'Nacionales' },
            { icon: <FaMapMarkerAlt />, label: 'Locales' },
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-center px-4 py-3 cursor-pointer rounded-md transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0C2342'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold text-white border-b-4 border-accent inline-block mb-8">
          📰 Generales
        </h1>

        <ul className="space-y-6">
          {allPosts.map((post) => (
            <li
              key={post.id}
              onClick={() => navigate('/post')}
              className="cursor-pointer rounded-lg p-6 transition-shadow duration-300 shadow-md hover:shadow-xl"
              style={{
                backgroundColor: 'rgba(12, 35, 66, 0.4)', // efecto semi-transparente igual que navbar
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h2 className="text-2xl font-semibold text-white mb-2 hover:text-white/80">
                {post.title}
              </h2>
              <p className="text-gray-300 mb-2">👁️ {post.views} vistas</p>

              {/* Resumen / contenido */}
              <p className="text-white leading-relaxed mb-2">
                {expandedPosts[post.id] ? post.content : post.summary}
              </p>

              {/* Botón ver más */}
              <button
                onClick={(e) => { e.stopPropagation(); togglePost(post.id); }}
                className="flex items-center text-accent hover:text-accentLight font-medium focus:outline-none"
              >
                {expandedPosts[post.id] ? 'Ver menos' : 'Ver más'}
                <span className="ml-1">{expandedPosts[post.id] ? '▲' : '▼'}</span>
              </button>

              {/* Like y Favoritos */}
              <div className="flex items-center space-x-6 mt-4 text-gray-300">
                <button className="flex items-center hover:text-primaryLight focus:outline-none">
                  <FaThumbsUp className="mr-2" /> Me gusta
                </button>
                <button className="flex items-center hover:text-accent focus:outline-none">
                  <FaHeart className="mr-2" /> Favoritos
                </button>
              </div>

              {/* 🔗 Link a noticia completa */}
              <div className="mt-4">
                <span className="text-sm text-secondary font-medium">
                  🔗 Ver noticia completa
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);


};

export default Home;

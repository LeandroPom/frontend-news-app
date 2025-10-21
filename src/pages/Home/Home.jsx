// Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";
import Sidebar from "../../pages/Home/Sidebar";
import axios from "axios";
// Al inicio del archivo
import SidebarPublicidad from "../../pages/Home/SidebarPublicidad"; // Ajustá la ruta según tu estructura
import Carousel from "../Carrousel/Carrousel";


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [cotizaciones, setCotizaciones] = useState({
    oficial: "---",
    blue: "---",
    mayorista: "---",
  });
  const [banners, setBanners] = useState([]);

  useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await axios.get("/banners");
      setBanners(res.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  fetchBanners();
}, []);


  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts"); // tu backend

      // Ordenamos primero por rating_positive descendente
      const sortedPosts = [...res.data].sort(
        (a, b) => (b.rating_positive || 0) - (a.rating_positive || 0)
      );

      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


    const fetchDolar = async () => {
      try {
        const res = await axios.get("https://api.argentinadatos.com/v1/cotizaciones/dolares/");
        const data = res.data;

        // Tomamos el último valor por cada tipo
        const ultimoOficial = [...data].reverse().find(d => d.casa === "oficial");
        const ultimoBlue = [...data].reverse().find(d => d.casa === "blue");
        const ultimoMayorista = [...data].reverse().find(d => d.casa === "mayorista");

        setCotizaciones({
          oficial: ultimoOficial?.venta || "---",
          blue: ultimoBlue?.venta || "---",
          mayorista: ultimoMayorista?.venta || "---",
        });
      } catch (error) {
        console.error("Error fetching dolar:", error);
      }
    };

    fetchPosts();
    fetchDolar();
  }, []);

 // Solo posts activos
const sortedActivePosts = posts
  .filter(p => p.active) 
  .sort((a, b) => (b.rating_positive || 0) - (a.rating_positive || 0));

const mainPost = sortedActivePosts[0];
const secondaryPosts = sortedActivePosts.slice(1, 3);
const otherPosts = sortedActivePosts.slice(3);

  const getPostImage = (post) => {
    return post.PostMedia?.length > 0
      ? post.PostMedia[0].url
      : "/placeholder.jpg";
  };

  const sanitizeHeadline = (html) => {
    return html.replace(/<\/?h1[^>]*>/g, ""); // elimina <h1> y </h1>
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Carousel banners={banners} />

      {/* Franja de cotizaciones */}
      <div className="bg-gray-800 text-white py-2 px-4 flex justify-around text-sm">
        <span>Dólar Oficial: {cotizaciones.oficial}</span>
        <span>Dólar Blue: {cotizaciones.blue}</span>
        <span>Dólar Mayorista: {cotizaciones.mayorista}</span>
      </div>

      
        {/* Sidebar izquierdo */}
        <div className="relative flex flex-col lg:flex-row max-w-7xl mx-auto mt-10 px-4 gap-4">
  {/* Sidebar flotante */}
  <Sidebar />

  {/* Noticias centrales */}
  <div className="flex-1 space-y-4 w-full">

          {/* Noticia principal */}
          {mainPost && (
            <Link to={`/post/${mainPost.post_id}`} className="block relative w-full h-64 md:h-96 rounded overflow-hidden shadow-md">
              <img
                src={getPostImage(mainPost)}
                alt={mainPost.headLine}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-4">
                <h3
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: sanitizeHeadline(mainPost.headLine) }}
                ></h3>
                <p
                  className="text-sm md:text-base line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: mainPost.lead }}
                />
              </div>
            </Link>
          )}

          {/* Dos noticias secundarias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryPosts.map((post) => (
              <Link
                key={post.post_id}
                to={`/post/${post.post_id}`}
                className="relative h-64 rounded overflow-hidden shadow-md block"
              >
                <img
                  src={getPostImage(post)}
                  alt={post.headLine}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2">
                  <h3
                    className="font-semibold"
                    dangerouslySetInnerHTML={{ __html: sanitizeHeadline(post.headLine) }}
                  ></h3>

                  <p
                    className="text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.lead }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Resto de las noticias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherPosts.map((post) => (
              <Link
                key={post.post_id}
                to={`/post/${post.post_id}`}
                className="bg-white rounded shadow p-2 block"
              >
                <img
                  src={getPostImage(post)}
                  alt={post.headLine}
                  className="w-full h-40 object-cover rounded"
                />
                <h3
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: sanitizeHeadline(post.headLine) }}
                ></h3>
                <p
                  className="text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.lead }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar derecho / publicidad */}
        <div className="w-full lg:w-1/5">
          <SidebarPublicidad />
        </div>
      </div>
    </div>
  );
};

export default Home;

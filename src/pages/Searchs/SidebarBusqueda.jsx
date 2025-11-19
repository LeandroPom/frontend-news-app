import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Busqueda = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFromURL = params.get("tag") || "";
    setSelectedTag(tagFromURL);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, tagsRes] = await Promise.all([
          axios.get("/posts"),
          axios.get("/tags"),
        ]);

        const postsWithTags = postsRes.data.map((p) => ({
          ...p,
          Tags: p.Tags?.map((t) => ({ tag_name: t.tag_name })) || [],
        }));

        setPosts(postsWithTags);
        setTags(tagsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrado + orden
  useEffect(() => {
    let result = [...posts];

    if (searchTerm) {
      result = result.filter((p) =>
        (p.headLine + p.lead + p.body)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      result = result.filter((p) =>
        p.Tags?.some((t) => t.tag_name === selectedTag)
      );
    }

    result = result.sort((a, b) => {
 switch (sortOrder) {
  case "newest":
    return new Date(b.createdAt) - new Date(a.createdAt);

  case "oldest":
    return new Date(a.createdAt) - new Date(b.createdAt);

  case "rating_high":
    return (b.rating_positive || 0) - (a.rating_positive || 0);

  case "rating_low":
    return (a.rating_positive || 0) - (b.rating_positive || 0);

  case "views_high":
    return (b.views || 0) - (a.views || 0);

  case "views_low":
    return (a.views || 0) - (b.views || 0);

  default:
    return 0;
}
});

    setFilteredPosts(result);
    setCurrentPage(1); // resetear a la primera página cada vez que cambia el filtro
  }, [posts, searchTerm, selectedTag, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-[#12335F]">
        Cargando noticias...
      </div>
    );
  }

  // 🔹 Calcular paginación
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  return (
    <div className="min-h-screen bg-[#12335F] p-4">
      {/* 🔹 Título + botón de regresar */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-white text-2xl font-bold">
          Búsqueda de Noticias
        </h2>

        <Link
          to="/home"
          className="flex items-center gap-2 text-white font-medium hover:text-blue-600 transition"
        >
          <span className="text-lg">⬅️</span> Regresar
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por título o contenido..."
          className="p-2 rounded flex-1 bg-white text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 rounded bg-white text-black"
        >
          <option value="">Todos los tags</option>
          {tags.map((tag) => (
            <option key={tag.tag_id} value={tag.tag_name}>
              {tag.tag_name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded bg-white text-black"
        >
          <option value="newest">Más nuevas</option>
          <option value="oldest">Más antiguas</option>
          {/* ⭐️ Nuevos filtros que pediste */}
          <option value="rating_high">Rating más alto</option>
          <option value="rating_low">Rating más bajo</option>
          <option value="views_high">Más visitas</option>
          <option value="views_low">Menos visitas</option>
        </select>
      </div>

      {/* Resultados */}
      {filteredPosts.length === 0 ? (
        <div className="text-black text-center mt-20">
          <h3 className="text-xl font-bold">No se encontraron noticias</h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <Link
                key={post.post_id}
                to={`/post/${post.post_id}`}
                className="bg-white rounded shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                {post.PostMedia?.length > 0 && (
                  <img
                    src={post.PostMedia[0].url}
                    alt={post.headLine}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-1">
                  {/* 🔹 headline con HTML */}
                  <h3
                    className="font-semibold text-lg mb-2"
                    dangerouslySetInnerHTML={{ __html: post.headLine }}
                  />

                  {/* lead con HTML */}
                  <div
                    className="text-sm text-gray-700 mb-2 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: post.lead }}
                  />

                  <div className="mt-auto flex justify-between text-xs text-gray-500">
                    <span>✍️ {post.User?.user_name}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>

          {/* 🔹 Paginación */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-white text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
            >
              ⬅️ Anterior
            </button>

            {/* Números de página */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:bg-gray-200"
                  } transition`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-white text-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
            >
              Siguiente ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Busqueda;

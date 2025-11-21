import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";
import { useSelector } from "react-redux";

function FavoritePosts() {
  // User desde Redux
  const reduxUser = useSelector((state) => state.posts.user);

  // LocalStorage solo se lee una vez
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  // User final
  const user = reduxUser || storedUser;
  const userId = user?.user_id;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setFavorites([]);
      setError("Usuario no logueado");
      return;
    }

    let cancelled = false;

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        // Trae favoritos
        const favRes = await axios.get(`/ratings/user/${userId}/favorites`);
        const favs = favRes.data || [];

        if (!Array.isArray(favs) || favs.length === 0) {
          if (!cancelled) {
            setFavorites([]);
            setLoading(false);
          }
          return;
        }

        // Para cada favorito trae sus datos completos si no vinieron embebidos
        const detailed = await Promise.all(
          favs.map(async (fav) => {
            const postFromFav = fav.Post || fav.post || fav.postData;
            if (postFromFav) return postFromFav;

            // Fetch individual
            try {
              const postRes = await axios.get(`/posts/${fav.post_id}`);
              const postData = Array.isArray(postRes.data)
                ? postRes.data[0]
                : postRes.data;
              return postData;
            } catch {
              return null;
            }
          })
        );

        const filtered = detailed.filter(Boolean);

        if (!cancelled) {
          setFavorites(filtered);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Error al cargar favoritos");
          setLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, [userId]); // ⬅️ SOLO userId !!

  // --- Resto del componente igual ---
  return (
    <div className="min-h-screen bg-[#12335F] text-black">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white/90 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-black">❤️ Mis Posts Favoritos</h1>

        {loading && <div className="py-10 text-center text-gray-600">Cargando favoritos...</div>}
        {!loading && error && <div className="py-6 text-center text-red-600">{error}</div>}

        {!loading && !error && favorites.length === 0 && (
          <p className="text-gray-600 text-center mt-6">
            Todavía no marcaste ningún post como favorito ❤️
          </p>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((post) => (
              <Link
                to={`/post/${post.post_id}`}
                key={post.post_id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex gap-3 items-start"
              >
                {/* Mini Imagen */}
                {post.PostMedia && post.PostMedia.length > 0 ? (
                  <img
                    src={post.PostMedia[0].url}
                    alt="mini"
                    className="w-28 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-28 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    Sin imagen
                  </div>
                )}

                {/* Texto */}
                <div className="flex-1">
                  <h2
                    className="font-bold text-base text-black leading-tight mb-1"
                    dangerouslySetInnerHTML={{ __html: post.headLine || "Sin título" }}
                  />
                  <p
                    className="text-gray-700 text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.lead || "" }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link to="/home" className="text-blue-600 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FavoritePosts;

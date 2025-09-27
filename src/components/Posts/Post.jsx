import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/NavBar/NavBar";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";

function Post() {
  const { id } = useParams(); // obtenemos el id del post
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false); // estado de like
  const [likesCount, setLikesCount] = useState(0); // contador de likes
  const user = useSelector((state) => state.posts.user);
  const userId = user?.user_id;
  // const userId = 1; 

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setPost(data);
        setLikesCount(data.rating_positive || 0);
      })
      .catch((err) => console.error(err));
  }, [id]);

 const handleLike = async () => {
  try {
    if (!post) return;

    if (!userId) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Debes estar logueado para dar 'Me gusta' 👍",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
      });
      return;
    }

    // toggle estado local
    setLiked((prev) => !prev);

    // actualizar contador localmente
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    // enviar al backend
    await axios.post("/ratings/vote", {
      post_id: Number(post.post_id),
      user_id: Number(userId),
      vote_type: "positive",
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ocurrió un error al registrar tu voto ❌",
    });
  }
};

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Cargando noticia...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12335F]">
      <Navbar />

      <div
        className="max-w-3xl mx-auto mt-8 p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.38)",
        }}
      >
        {/* Título */}
        <h1
          className="text-3xl font-bold mb-2"
          dangerouslySetInnerHTML={{ __html: post.headLine }}
        />

        {/* Autor y fecha */}
        <div className="flex items-center justify-between text-black text-sm mb-4">
          <span>✍️ {post.User?.user_name}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Vistas + Likes */}
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <p className="text-sm">👁️ {post.views} vistas</p>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm cursor-pointer hover:text-blue-600 transition"
          >
            {liked ? "👎 Ya no me gusta" : "👍 Me gusta"} ({likesCount})
          </button>
        </div>

        {/* Lead */}
        <div
          dangerouslySetInnerHTML={{ __html: post.lead }}
          className="text-black mb-4"
        />

        {/* Imagen destacada */}
        {post.PostMedia && post.PostMedia.length > 0 && (
          <img
            src={post.PostMedia[0].url}
            alt={post.headLine}
            className="w-full max-h-96 object-cover rounded-lg mb-4"
          />
        )}

        {/* Body */}
        <div
          dangerouslySetInnerHTML={{ __html: post.body }}
          className="text-black mb-4"
        />

        {/* Conclusion */}
        {post.conclusion && (
          <div
            dangerouslySetInnerHTML={{ __html: post.conclusion }}
            className="text-black font-semibold mb-6"
          />
        )}

        {/* Otros medios */}
        {post.PostMedia &&
          post.PostMedia.length > 1 &&
          post.PostMedia.slice(1).map((m, i) => (
            <div key={i} className="mb-4">
              {m.type === "image" ? (
                <img
                  src={m.url}
                  alt={`media-${i + 1}`}
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              ) : (
                <video controls className="w-full max-h-96 rounded-lg">
                  <source src={m.url} type="video/mp4" />
                </video>
              )}
            </div>
          ))}

        {/* Tags */}
        {post.Tags && post.Tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.Tags.map((tag) => (
              <Link
                key={tag.tag_id}
                to={`/busqueda?tag=${encodeURIComponent(tag.tag_name)}`}
                className="bg-accent text-black text-sm px-2 py-1 rounded hover:bg-accentLight"
              >
                #{tag.tag_name}
              </Link>
            ))}
          </div>
        )}

        {/* Botón volver */}
        <Link
          to="/home"
          className="inline-block text-accent hover:text-accentLight font-medium mt-6"
        >
          ← Volver a las noticias
        </Link>
      </div>
    </div>
  );
}

export default Post;

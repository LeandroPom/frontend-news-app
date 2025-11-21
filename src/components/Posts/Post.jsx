import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/NavBar/NavBar";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";


import axios from "axios";

function Post() {
  const { id } = useParams(); // obtenemos el id del post
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false); // estado de like
  const [likesCount, setLikesCount] = useState(0); // contador de likes
  const [disliked, setDisliked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(0);
  const user = useSelector((state) => state.posts.user);
  const [viewSent, setViewSent] = useState(false);
  const userId = user?.user_id;
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    if (!userId) return;

    axios.get(`/posts/${id}`).then((res) => {
      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      setPost(data);
      setLikesCount(data.rating_positive || 0);
      setDislikesCount(data.rating_negative || 0);

      const userVote = data.Votes?.find(
        v => Number(v.user_id) === Number(userId)
      );

      setLiked(userVote?.vote_type === "positive");
      setDisliked(userVote?.vote_type === "negative");
    });
  }, [id, userId]);

  useEffect(() => {
    if (!userId || !id) return;

    axios.get(`/ratings/user/${userId}/favorites`)
      .then(res => {
        const favorites = res.data || [];
        const found = favorites.some(f => Number(f.post_id) === Number(id));
        setIsFavorite(found);
      })
      .catch(err => console.error("Error cargando favoritos:", err));
  }, [userId, id]);

  useEffect(() => {
    if (!post || !userId || viewSent) return;

    axios
      .post("http://localhost:3001/ratings/view", {
        post_id: post.post_id,
        user_id: userId,
      })
      .then((res) => {
        const updated = Array.isArray(res.data) ? res.data[0] : res.data;

        setPost((prev) => ({
          ...prev,
          views: updated.views,
        }));

        setViewSent(true); // ⬅️ evita que vuelva a correr
      })
      .catch((err) => console.error("Error al sumar view:", err));
  }, [post, userId, viewSent]);


  const updateFromBackend = (updatedPost) => {
    setPost(prev => ({
      ...prev,
      rating_positive: updatedPost.rating_positive,
      rating_negative: updatedPost.rating_negative,
      Votes: updatedPost.Votes || prev.Votes
    }));

    setLikesCount(updatedPost.rating_positive || 0);
    setDislikesCount(updatedPost.rating_negative || 0);

    const userVote = updatedPost.Votes?.find(
      v => Number(v.user_id) === Number(userId)
    ) || null;

    setLiked(userVote?.vote_type === "positive");
    setDisliked(userVote?.vote_type === "negative");
    console.log("updatedPost recibido:", updatedPost);
  };

  const handleLike = async () => {
    if (!post || !userId) return;

    try {
      const res = await axios.post("/ratings/vote", {
        post_id: post.post_id,
        user_id: userId,
        vote_type: "positive",
      });

      updateFromBackend(res.data.post);

    } catch (err) {
      console.error(err);
    }
  };


  const handleDislike = async () => {
    if (!post || !userId) return;

    try {
      const res = await axios.post("/ratings/vote", {
        post_id: post.post_id,
        user_id: userId,
        vote_type: "negative",
      });

      updateFromBackend(res.data.post);
    } catch (err) {
      console.error(err);
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
        className="max-w-3xl mx-auto mt-20 p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.38)",
        }}
      >
        {/* Título */}
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-black text-3xl font-bold"
            dangerouslySetInnerHTML={{ __html: post.headLine }}
          />

          {/* Botón de favorito al lado del título */}
          {userId && (
            <FavoriteButton
              postId={post.post_id}
              userId={userId}
              initialFavorite={isFavorite}
            />
          )}
        </div>
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
          {/* Likes y Dislikes */}
          <div className="flex items-center gap-4 text-gray-600 mb-4">

            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm cursor-pointer hover:text-blue-600 transition"
            >
              👍 Me gusta ({likesCount})
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              className="flex items-center gap-1 text-sm cursor-pointer hover:text-red-600 transition"
            >
              👎 No me gusta ({dislikesCount})
            </button>

          </div>

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
          className="text-black inline-block text-accent hover:text-accentLight font-medium mt-6"
        >
          ← Volver a las noticias
        </Link>
      </div>
    </div>
  );
}

export default Post;

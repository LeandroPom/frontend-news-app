import React, { useState, useEffect } from "react";
import axios from "axios";

function FavoriteButton({ postId, userId, initialFavorite }) {
  const [favorite, setFavorite] = useState(initialFavorite);

  useEffect(() => {
    setFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleFavorite = async () => {
    if (!postId || !userId) return;

    try {
      const res = await axios.post("/ratings/favorite", {
        user_id: userId,
        post_id: postId,
      });

      setFavorite(res.data.isFavorite);
    } catch (err) {
      console.error("Error al marcar favorito:", err);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`flex items-center gap-1 text-sm cursor-pointer transition 
        ${favorite ? "text-red-600" : "text-gray-600"} hover:text-red-600`}
    >
      {favorite ? "❤️ Favorito" : "🤍 Favorito"}
    </button>
  );
}

export default FavoriteButton;

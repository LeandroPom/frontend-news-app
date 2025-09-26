// TagSelector.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const TagSelector = ({ selectedTags = [], setSelectedTags }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);

  // Traer tags existentes al montar el componente
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:3001/tags/");
        setTags(res.data);
      } catch (err) {
        console.error("Error al traer los tags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Crear nuevo tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await axios.post("http://localhost:3001/tags/", {
        tag_name: newTag.trim(),
      });
      setNewTag("");

      // Refrescar lista de tags
      const res = await axios.get("http://localhost:3001/tags/");
      setTags(res.data);
    } catch (err) {
      console.error("Error creando tag:", err);
      alert("Error creando tag");
    }
  };

  // Toggle tag seleccionado
  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      (prev || []).includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...(prev || []), tagId]
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-[150px] px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        {/* Crear nuevo tag */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Nuevo tag"
            className="flex-1 p-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            onClick={handleAddTag}
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded transition"
          >
            Crear Tag
          </button>
        </div>

        {/* Lista de tags o spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.tag_id}
                onClick={() => toggleTag(tag.tag_id)}
                className={`px-3 py-1 rounded cursor-pointer transition ${
                  selectedTags.includes(tag.tag_id)
                    ? "bg-blue-600 text-black"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;

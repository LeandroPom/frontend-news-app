import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";

const API_URL = "http://localhost:3001/tags/";

const TagSelector = ({ selectedTags = [], setSelectedTags }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar tags al montar
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await axios.get(API_URL);
      setTags(res.data);
    } catch (err) {
      console.error("Error al traer los tags:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear nuevo tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await axios.post(API_URL, { tag_name: newTag.trim() });
      setNewTag("");
      await fetchTags();
    } catch (err) {
      console.error("Error creando tag:", err);
      alert("Error creando tag");
    }
  };

  // 🔹 Editar tag
  const startEditing = (tag) => {
    setEditingTag(tag.tag_id);
    setEditName(tag.tag_name);
  };

  const handleEditTag = async (tagId) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`${API_URL}${tagId}`, { tag_name: editName.trim() });
      setEditingTag(null);
      await fetchTags();
    } catch (err) {
      console.error("Error editando tag:", err);
      alert("Error editando tag");
    }
  };

  // 🔹 Eliminar tag
  const handleDeleteTag = async (tagId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta etiqueta?")) return;
    try {
      await axios.delete(`${API_URL}${tagId}`);
      await fetchTags();
    } catch (err) {
      console.error("Error eliminando tag:", err);
      alert("Error eliminando tag");
    }
  };

  // 🔹 Seleccionar/deseleccionar
  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      (prev || []).includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...(prev || []), tagId]
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-[150px] px-4 bg-gradient-to-br from-blue-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Gestor de Etiquetas 🏷️
        </h2>

        {/* Crear nuevo tag */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Nueva etiqueta..."
            className="flex-1 p-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            onClick={handleAddTag}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
          >
            <Plus size={18} /> Crear
          </button>
        </div>

        {/* Lista de tags */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            layout
            className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1"
          >
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.div
                  key={tag.tag_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg shadow-sm ${
                    selectedTags.includes(tag.tag_id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {/* Si está en modo edición */}
                  {editingTag === tag.tag_id ? (
                    <div className="flex items-center w-full gap-2">
                      <input
                        type="text"
                        className="flex-1 p-1 border border-gray-300 rounded text-black focus:ring-1 focus:ring-blue-400"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <button
                        onClick={() => handleEditTag(tag.tag_id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg transition"
                        title="Guardar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingTag(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white p-1.5 rounded-lg transition"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        onClick={() => toggleTag(tag.tag_id)}
                        className="flex-1 cursor-pointer font-medium select-none"
                      >
                        {tag.tag_name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(tag)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black p-1.5 rounded-lg transition"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.tag_id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TagSelector;

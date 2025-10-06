// AdminPostPanel.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  fetchPosts,
  searchPosts,
  editPost,
  togglePostActive,
  deletePost,
} from "../../redux/actions/postsActions";

const PAGE_SIZE = 10;

export default function AdminPostPanel() {
  const dispatch = useDispatch();
  const { allPosts, postsLoading, user } = useSelector((state) => state.posts);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const modules = {
    toolbar: [
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };
  const formats = ["bold", "italic", "list", "bullet", "link", "image"];

  if (!user || !user.roles?.admin) {
    return <div className="p-4 text-center text-red-500">🚫 No tienes permisos</div>;
  }

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPosts(allPosts);
  }, [allPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setFilteredPosts(allPosts);
      return;
    }
    dispatch(searchPosts(search));
  };

  const selectForEdit = (post) => {
    setSelectedPost(post);
    setEditData({
      headLine: post.headLine,
      lead: post.lead,
      body: post.body,
      conclusion: post.conclusion,
      tags: post.Tags?.map((t) => t.tag_id) || [],
      media: post.PostMedia || [],
      active: post.active,
    });
  };

  const saveEdit = () => {
    dispatch(editPost(selectedPost.post_id, editData));
    setSelectedPost(null);
  };

  const handleToggleActive = (id, active) => {
    dispatch(togglePostActive(id, active));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este post?")) return;
    dispatch(deletePost(id));
  };

  const totalPages = Math.ceil(filteredPosts?.length / PAGE_SIZE);
  const paginatedPosts = filteredPosts?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

   const sanitizeHeadline = (html) => {
    return html.replace(/<\/?h1[^>]*>/g, ""); // elimina <h1> y </h1>
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📝 Panel de Posts</h1>

      {/* Búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar post..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        />
        <button className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600">Buscar</button>
      </form>

      {/* Loading */}
      {postsLoading && <p>Cargando posts...</p>}

      {/* Tabla de posts */}
      {!postsLoading && (
        <>
          <table className="text-black min-w-full border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Headline</th>
                <th className="p-2 border">Tags</th>
                <th className="p-2 border">Activo</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts?.map((p) => (
                <tr key={p.post_id} className="bg-gray-400 text-center">
                  <td className="border p-2">{p.post_id}</td>
                  <td
  className="border p-2"
  dangerouslySetInnerHTML={{ __html: sanitizeHeadline(p.headLine) }}
></td>
                  <td className="border p-2">{p.Tags?.map((t) => t.tag_name).join(", ") || "—"}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleToggleActive(p.post_id, p.active)}
                      className={`px-3 py-1 rounded-lg text-black ${p.active ? "bg-green-500" : "bg-gray-400"}`}
                    >
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button onClick={() => selectForEdit(p)} className="bg-yellow-400 px-3 py-1 rounded-lg">Editar</button>
                    <button onClick={() => handleDelete(p.post_id)} className="bg-red-500 px-3 py-1 rounded-lg">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Editor inline dentro del panel */}
      {selectedPost && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Editar Post #{selectedPost.post_id}</h2>

          <div className="flex flex-col gap-4">
            <ReactQuill
              value={editData.headLine}
              onChange={(value) => setEditData({ ...editData, headLine: value })}
              modules={modules}
              formats={formats}
              className="bg-white"
            />
            <ReactQuill
              value={editData.lead}
              onChange={(value) => setEditData({ ...editData, lead: value })}
              modules={modules}
              formats={formats}
              className="bg-white"
            />
            <ReactQuill
              value={editData.body}
              onChange={(value) => setEditData({ ...editData, body: value })}
              modules={modules}
              formats={formats}
              className="bg-white"
            />
            <ReactQuill
              value={editData.conclusion}
              onChange={(value) => setEditData({ ...editData, conclusion: value })}
              modules={modules}
              formats={formats}
              className="bg-white"
            />

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={editData.active}
                onChange={() => setEditData({ ...editData, active: !editData.active })}
                className="accent-blue-500"
              />
              Activo
            </label>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPost.Tags?.map((t) => (
                <span key={t.tag_id} className="px-3 py-1 bg-gray-300 rounded">{t.tag_name}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
            <button
              onClick={() => setSelectedPost(null)}
              className="px-4 py-2 bg-gray-300 rounded-lg w-full md:w-auto"
            >
              Cancelar
            </button>
            <button
              onClick={saveEdit}
              className="px-4 py-2 bg-blue-600 text-black rounded-lg w-full md:w-auto"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

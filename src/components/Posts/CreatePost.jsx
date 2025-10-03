import React, { useState, useEffect } from "react";
import Navbar from "../../components/NavBar/NavBar";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import mammoth from "mammoth";
import { useSelector } from "react-redux";

function Post() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [post, setPost] = useState({
    headLine: "",
    lead: "",
    body: "",
    conclusion: "",
    media: [],
  });
  const [wordFile, setWordFile] = useState(null);
  const user = useSelector((state) => state.posts.user);
  


  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],  // Encabezados
      ["bold", "italic", "underline", "strike"], // Estilos básicos
      [{ color: [] }, { background: [] }], // Colores de texto y fondo
      [{ script: "sub" }, { script: "super" }], // Subíndice / superíndice
      [{ list: "ordered" }, { list: "bullet" }], // Listas
      [{ indent: "-1" }, { indent: "+1" }], // Sangría
      [{ align: [] }], // Alineación
      ["link", "image", "video"], // Multimedia
      ["clean"], // Quitar formato
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "script",
    "list", "bullet", "indent",
    "align",
    "link", "image", "video",
  ];

  // Función para traer los tags
  const fetchTags = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/tags/");
      const normalized = data.map((t) => ({
        tag_id: t.tag_id || t.id,
        tag_name: t.tag_name || t.name,
      }));
      setTags(normalized);
    } catch (err) {
      console.error("Error trayendo tags:", err);
    }
  };

  useEffect(() => {
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
      fetchTags(); // refrescar la lista de tags después de crear uno nuevo
    } catch (err) {
      console.error("Error creando tag:", err);
      alert("Error creando tag");
    }
  };

  // Selección de tags
  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Agregar media
  const addMedia = (url, type) => {
    setPost((prev) => ({ ...prev, media: [...prev.media, { url, type }] }));
  };

  // Crear post
 const handleCreatePost = async () => {
  try {
    if (!user || !user.user_id) {
      alert("No hay usuario logueado");
      return;
    }

    const payload = { 
      ...post, 
      tags: selectedTags, 
      user_id: user.user_id  // 👈 usamos el id real del usuario logueado
    };

    console.log("Payload enviado al backend:", payload);

    await axios.post("/posts", payload);
    alert("Post creado con éxito");

    setPost({ headLine: "", lead: "", body: "", conclusion: "", media: [] });
    setSelectedTags([]);
    setWordFile(null);
  } catch (err) {
    console.error("Error creando post:", err);
    alert("Error creando post");
  }
};

  const handleWordUpload = async (file) => {
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        setPost((prev) => ({ ...prev, body: value }));
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error leyendo Word:", err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#12335F" }}>
      {/* <Navbar /> */}

      <div
        className="max-w-3xl mx-auto mt-8 p-6 rounded-lg shadow-md"
        style={{
          backgroundColor: "rgba(12, 35, 66, 0.4)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h2 className="text-2xl font-bold text-black mb-4">Crear nuevo post</h2>

        <ReactQuill
          theme="snow"
          placeholder="Headline"
          className="w-full mb-4 p-2 text-black bg-white rounded"
          value={post.headLine}
          onChange={(value) => setPost({ ...post, headLine: value })}
          modules={modules}
          formats={formats}
        />

        <ReactQuill
          theme="snow"
          placeholder="Lead"
          value={post.lead}
          onChange={(value) => setPost({ ...post, lead: value })}
          className="mb-4 bg-white text-black"
          modules={modules}
          formats={formats}
        />
        <ReactQuill
          theme="snow"
          placeholder="Body"
          value={post.body}
          onChange={(value) => setPost({ ...post, body: value })}
          className="mb-4 bg-white text-black"
          modules={modules}
          formats={formats}
        />
        <ReactQuill
          theme="snow"
          placeholder="Conclusion"
          value={post.conclusion}
          onChange={(value) => setPost({ ...post, conclusion: value })}
          className="mb-4 bg-white text-black"
          modules={modules}
          formats={formats}
        />

        {/* Word File */}
        <div className="mb-4">
          <label className="text-black mr-2">Cargar archivo Word:</label>
          <input
            type="file"
            accept=".doc,.docx"
            onChange={(e) => {
              const file = e.target.files[0];
              setWordFile(file);
              handleWordUpload(file);
            }}
          />
          {wordFile && (
            <p className="text-black mt-1">Archivo seleccionado: {wordFile.name}</p>
          )}
        </div>

        {/* Media */}
        <div className="mb-4 flex text-black gap-2">
          <input type="text" id="mediaUrl" placeholder="URL media" className="p-2 rounded" />
          <select id="mediaType" className="p-2 rounded">
            <option value="image">Imagen</option>
            <option value="video">Video</option>
          </select>
          <button
            onClick={() => {
              const url = document.getElementById("mediaUrl").value;
              const type = document.getElementById("mediaType").value;
              addMedia(url, type);
              document.getElementById("mediaUrl").value = "";
            }}
            className="bg-blue-500 text-black px-4 py-2 rounded"
          >
            Agregar media
          </button>
        </div>
        <div className="mb-4">
          {post.media.map((m, i) => (
            <p key={i} className="text-black">
              {m.type}: {m.url}
            </p>
          ))}
        </div>


        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.tag_id}
              onClick={() => toggleTag(tag.tag_id)}
              className={`px-3 py-1 rounded cursor-pointer ${selectedTags.includes(tag.tag_id)
                  ? "bg-blue-600 text-black"
                  : "bg-gray-300 text-black"
                }`}
            >
              {tag.tag_name}
            </span>
          ))}
        </div>


        <button
          onClick={handleCreatePost}
          className="bg-[#215caa] hover:bg-[#1B4A8A] py-2 rounded font-bold transition-colors"
        >
          Crear Post
        </button>
      </div>
    </div>
  );
}

export default Post;

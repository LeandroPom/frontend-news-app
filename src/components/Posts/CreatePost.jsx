// CreatePost.jsx
import React, { useState } from "react";
import Navbar from "../../components/NavBar/NavBar";

const CreatePost = () => {
  const [headline, setHeadline] = useState("");
  const [lead, setLead] = useState("");
  const [body, setBody] = useState("");
  const [conclusion, setConclusion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!headline || !lead || !body) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const newPost = { headline, lead, body, conclusion };
    console.log("Nuevo post:", newPost);

    // Aquí harías tu POST al backend
    // axios.post('/api/posts', newPost).then(...)

    // Limpiar formulario
    setHeadline("");
    setLead("");
    setBody("");
    setConclusion("");
  };

  return (
    <div className="min-h-screen bg-[#12335F] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-8 p-6 bg-[#0C2342] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 border-b-4 border-[#215caa] inline-block">
          Crear Noticia
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Headline */}
          <div>
            <label className="block mb-2 font-bold">Título principal *</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Ingrese el título de la noticia"
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#215caa]"
              required
            />
          </div>

          {/* Lead */}
          <div>
            <label className="block mb-2 font-bold">Lead *</label>
            <textarea
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              placeholder="Resumen inicial de la noticia"
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#215caa]"
              rows={3}
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block mb-2 font-bold">Cuerpo de la noticia *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Texto completo de la noticia. Podés incluir links a imágenes o videos."
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#215caa]"
              rows={6}
              required
            />
          </div>

          {/* Conclusion */}
          <div>
            <label className="block mb-2 font-bold">Conclusión (opcional)</label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Conclusión o comentarios finales"
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#215caa]"
              rows={3}
            />
          </div>

          {/* Botón enviar */}
          <div>
            <button
              type="submit"
              className="bg-[#215caa] hover:bg-[#1B4A8A] py-3 px-6 rounded font-bold transition-colors w-full md:w-auto"
            >
              Crear Noticia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

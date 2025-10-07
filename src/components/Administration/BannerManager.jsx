import React, { useEffect, useState } from "react";
import axios from "axios";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({
    banner_name: "",
    banner_id: "",
    img: [],
    timer: false,
    timer_start: "",
    timer_end: "",
    priority: false,
  });

  // Cargar todos los banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/banners");
      setBanners(res.data);
      console.log(res.data, "respuesta del back");
    } catch (err) {
      console.error(err);
      alert("Error al cargar banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Crear o editar banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await axios.put(`/banners/${editingBanner.banner_id}`, form);
        setEditingBanner(null);
      } else {
        await axios.post("/banners", form);
      }
      setForm({
        banner_name: "",
        banner_id: "",
        img: [],
        timer: false,
        timer_start: "",
        timer_end: "",
        priority: false,
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error al guardar banner");
    }
  };

  // Activar/Desactivar
  const toggleActive = async (id) => {
    try {
      await axios.patch(`/banners/${id}/active`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado");
    }
  };

  // Eliminar banner
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este banner?")) return;
    try {
      await axios.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar banner");
    }
  };

  // Editar banner
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      banner_name: banner.banner_name,
      banner_id: banner.banner_id,
      img: banner.img,
      timer: banner.timer,
      timer_start: banner.timer_start || "",
      timer_end: banner.timer_end || "",
      priority: banner.priority,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Administrar Banners</h2>

      {/* Formulario Crear/Editar */}
      <form
        onSubmit={handleSubmit}
        className="text-black mb-6 p-4 border rounded-lg bg-white shadow-md flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Nombre del banner"
          className="border p-2 rounded"
          value={form.banner_name}
          onChange={(e) => setForm({ ...form, banner_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="URLs de imagen (separar con comas)"
          className="border p-2 rounded"
          value={form.img.join(",")}
          onChange={(e) =>
            setForm({ ...form, img: e.target.value.split(",") })
          }
          required
        />
        <label className="text-black flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.checked })
            }
          />
          Prioridad
        </label>
        <label className="text-black flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.timer}
            onChange={(e) => setForm({ ...form, timer: e.target.checked })}
          />
          Timer
        </label>
        {form.timer && (
          <div className="text-black flex flex-col gap-2">
            <input
              type="datetime-local"
              value={form.timer_start}
              onChange={(e) =>
                setForm({ ...form, timer_start: e.target.value })
              }
            />
            <input
              type="datetime-local"
              value={form.timer_end}
              onChange={(e) => setForm({ ...form, timer_end: e.target.value })}
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-black py-2 px-4 rounded shadow hover:bg-blue-600 transition"
        >
          {editingBanner ? "Actualizar Banner" : "Crear Banner"}
        </button>
        {editingBanner && (
          <button
            type="button"
            onClick={() => {
              setEditingBanner(null);
              setForm({
                banner_name: "",
                banner_id: "",
                img: [],
                timer: false,
                timer_start: "",
                timer_end: "",
                priority: false,
              });
            }}
            className="bg-gray-300 text-black py-2 px-4 rounded shadow hover:bg-gray-400 transition mt-2"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de Banners */}
      {loading ? (
        <p>Cargando banners...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {banners.map((banner) => (
            <div
              key={banner.banner_id}
              className="flex justify-between items-center p-4 bg-white shadow rounded"
            >
              <div>
                <h3 className="text-black font-semibold">{banner.banner_name}</h3>
                <p className="text-black font-semibold">{banner.img.join(", ")}</p>
                <p className="text-black font-semibold">Activo: {banner.active ? "Sí" : "No"}</p>
                {banner.timer && (
                  <p className="text-black font-semibold">
                    Timer: {banner.timer_start} - {banner.timer_end}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(banner.banner_id)}
                  className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  {banner.active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => handleDelete(banner.banner_id)}
                  className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerManager;

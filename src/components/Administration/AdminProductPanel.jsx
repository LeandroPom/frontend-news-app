import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ProductPanel = () => {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product_name: "",
    product_price: "",
    product_amount: "",
    is_unlimited: false,
    discount_percent: 0,
    discount_active: false,
    active: true,
    description: "",
    product_img: ""
  });

  const API = "http://localhost:3001/products";

  // 🔹 Obtener productos
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      const productsFromBack = Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setProducts(productsFromBack);
    } catch (error) {
      console.error("Error trayendo productos:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Crear producto
  const handleCreate = async (e) => {
    e.preventDefault();

    const payload = {
      product_name: form.product_name.trim(),
      product_price: parseFloat(form.product_price),
      product_amount: form.is_unlimited
        ? null
        : parseInt(form.product_amount),
      is_unlimited: form.is_unlimited,
      discount_percent: parseFloat(form.discount_percent) || 0,
      discount_active: form.discount_active,
      active: form.active,
      description: form.description,
      product_img: form.product_img
    };

    if (!payload.product_name) {
      Swal.fire("Error", "El nombre es obligatorio", "error");
      return;
    }

    if (isNaN(payload.product_price) || payload.product_price <= 0) {
      Swal.fire("Error", "El precio debe ser mayor a 0", "error");
      return;
    }

    if (!payload.is_unlimited) {
      if (
        isNaN(payload.product_amount) ||
        payload.product_amount < 0
      ) {
        Swal.fire("Error", "Stock inválido", "error");
        return;
      }
    }

    if (
      payload.discount_active &&
      (payload.discount_percent < 0 || payload.discount_percent > 100)
    ) {
      Swal.fire("Error", "El descuento debe estar entre 0 y 100", "error");
      return;
    }

    try {
      await axios.post(API, payload);

      Swal.fire("Creado", "Producto creado correctamente", "success");

      setForm({
        product_name: "",
        product_price: "",
        product_amount: "",
        is_unlimited: false,
        discount_percent: 0,
        discount_active: false,
        active: true,
        description: "",
        product_img: ""
      });

      fetchProducts();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "No se pudo crear",
        "error"
      );
    }
  };

  // 🔹 Editar producto completo
  const handleUpdate = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar producto",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${product.product_name}">
        <input id="swal-price" type="number" step="0.01" class="swal2-input" placeholder="Precio" value="${product.product_price}">
        <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${product.product_amount ?? ""}">
        
        <div style="margin-top:10px;text-align:left;">
          <label><input type="checkbox" id="swal-unlimited" ${product.is_unlimited ? "checked" : ""}> Ilimitado</label>
        </div>

        <div style="margin-top:10px;text-align:left;">
          <label><input type="checkbox" id="swal-discount-active" ${product.discount_active ? "checked" : ""}> Activar descuento</label>
        </div>

        <input id="swal-discount" type="number" class="swal2-input" placeholder="% Descuento" value="${product.discount_percent ?? 0}">

        <div style="margin-top:10px;text-align:left;">
          <label><input type="checkbox" id="swal-active" ${product.active ? "checked" : ""}> Producto activo</label>
        </div>

        <input id="swal-desc" class="swal2-input" placeholder="Descripción" value="${product.description ?? ""}">
        <input id="swal-img" class="swal2-input" placeholder="URL Imagen" value="${product.product_img ?? ""}">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      preConfirm: () => {
        return {
          product_name: document.getElementById("swal-name").value.trim(),
          product_price: parseFloat(document.getElementById("swal-price").value),
          product_amount: parseInt(document.getElementById("swal-stock").value),
          is_unlimited: document.getElementById("swal-unlimited").checked,
          discount_active: document.getElementById("swal-discount-active").checked,
          discount_percent: parseFloat(document.getElementById("swal-discount").value) || 0,
          active: document.getElementById("swal-active").checked,
          description: document.getElementById("swal-desc").value,
          product_img: document.getElementById("swal-img").value
        };
      }
    });

    if (!formValues) return;

    try {
      await axios.put(`${API}/${product.product_id}`, formValues);

      Swal.fire("Actualizado", "Producto actualizado", "success");
      fetchProducts();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "No se pudo actualizar",
        "error"
      );
    }
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    });

    if (!result.isConfirmed) return;

    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Panel de Productos
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded shadow p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
      >
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded"
          value={form.product_name}
          onChange={(e) =>
            setForm({ ...form, product_name: e.target.value })
          }
        />

        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          className="border p-2 rounded"
          value={form.product_price}
          onChange={(e) =>
            setForm({ ...form, product_price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          disabled={form.is_unlimited}
          className="border p-2 rounded"
          value={form.product_amount}
          onChange={(e) =>
            setForm({ ...form, product_amount: e.target.value })
          }
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_unlimited}
            onChange={(e) =>
              setForm({ ...form, is_unlimited: e.target.checked })
            }
          />
          <label>Ilimitado</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.discount_active}
            onChange={(e) =>
              setForm({ ...form, discount_active: e.target.checked })
            }
          />
          <label>Descuento activo</label>
        </div>

        <input
          type="number"
          placeholder="% Descuento"
          disabled={!form.discount_active}
          className="border p-2 rounded"
          value={form.discount_percent}
          onChange={(e) =>
            setForm({ ...form, discount_percent: e.target.value })
          }
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({ ...form, active: e.target.checked })
            }
          />
          <label>Producto activo</label>
        </div>

        <input
          type="text"
          placeholder="Descripción"
          className="border p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="URL Imagen"
          className="border p-2 rounded"
          value={form.product_img}
          onChange={(e) =>
            setForm({ ...form, product_img: e.target.value })
          }
        />

        <button className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition col-span-1 md:col-span-2">
          Crear producto
        </button>
      </form>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const finalPrice = p.discount_active
            ? p.product_price -
              (p.product_price * p.discount_percent) / 100
            : p.product_price;

          return (
            <div
              key={p.product_id}
              className="bg-white rounded shadow p-4 flex flex-col"
            >
              {p.product_img && (
                <img
                  src={p.product_img}
                  alt=""
                  className="h-40 object-cover rounded mb-3"
                />
              )}

              <h3 className="font-bold text-lg text-black">{p.product_name}</h3>

              <p className="text-black text-sm mb-2">
                {p.description}
              </p>

              <div className="mb-2">
                {p.discount_active ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      ${p.product_price}
                    </span>
                    <span className="text-green-600 font-bold">
                      ${finalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-black">
                    ${p.product_price}
                  </span>
                )}
              </div>

              <div className="text-sm mb-2 text-black">
                {p.is_unlimited
                  ? "Stock: Ilimitado"
                  : `Stock: ${p.product_amount}`}
              </div>

              <div className="mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    p.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.active ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleUpdate(p)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.product_id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPanel;

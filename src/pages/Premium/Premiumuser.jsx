import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";

export default function PremiumBenefits() {
  const [products, setProducts] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});

  const user = useSelector((state) => state.posts.user);
  const user_id = user?.user_id;

  // -------- Obtener productos activos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/products");
        const productsFromBack = Array.isArray(data.data) ? data.data : [];
        const activeProducts = productsFromBack.filter((p) => p.active);
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error trayendo productos:", error);
      }
    };

    fetchProducts();
    updateCartCount();
  }, []);

  // -------- contador carrito
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  // -------- agregar producto
  const handleAddToCart = (product, quantity = 1) => {
    if (!user_id) {
      return Swal.fire("Error", "Debes iniciar sesión", "error");
    }

    if (!product.is_unlimited && product.product_amount <= 0) {
      return Swal.fire("Sin stock", "Este producto está agotado", "warning");
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) => item.product_id === product.product_id
    );

    const finalPrice = product.discount_active
      ? product.product_price -
      (product.product_price * product.discount_percent) / 100
      : product.product_price;

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        product_img: product.product_img, // 🔥 AGREGAR ESTO
        price: finalPrice,
        quantity,
        type: product.product_name.toLowerCase(),
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    updateCartCount();

    setQuantities({
      ...quantities,
      [product.product_id]: 1,
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.product_name} agregado`,
      showConfirmButton: false,
      timer: 1800,
    });
  };

  const handleFinish = () => {
    window.location.href = "/cart";
  };

  return (
    <div className="w-full flex flex-col items-center py-20 px-4 sm:px-6 bg-white">
      <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-16 tracking-tight text-center">
        Planes disponibles
      </h2>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {products.map((product) => {
          const finalPrice = product.discount_active
            ? product.product_price -
            (product.product_price * product.discount_percent) / 100
            : product.product_price;

          const outOfStock =
            !product.is_unlimited && product.product_amount <= 0;

          return (
            <div
              key={product.product_id}
              className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[400px] relative"
            >
              {/* Badge descuento */}
              {product.discount_active && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  -{product.discount_percent}%
                </span>
              )}

              {/* Imagen del producto */}
              {product.product_img && (
                <div className="w-32 h-32 mb-6 mx-auto">
                  <img
                    src={product.product_img}
                    alt={product.product_name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              )}

              <div className="flex flex-col items-center text-center text-black">
                <h3 className="text-2xl font-semibold text-black mb-4">
                  {product.product_name}
                </h3>

                {/* Precio */}
                <div className="mb-4 text-black">
                  <p className="text-4xl font-bold text-black">
                    ${finalPrice.toFixed(2)}
                  </p>

                  {product.discount_active && (
                    <p className="text-gray-400 line-through text-lg">
                      ${product.product_price}
                    </p>
                  )}
                </div>

                {/* Stock */}
                {!product.is_unlimited && (
                  <p
                    className={`text-sm mb-4 text-black ${outOfStock ? "text-red-600" : "text-gray-500"
                      }`}
                  >
                    {outOfStock
                      ? "Sin stock"
                      : `Stock disponible: ${product.product_amount}`}
                  </p>
                )}
              </div>

              {/* Selector cantidad */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Cantidad:
                </span>
                <input
                  type="number"
                  min="1"
                  max={
                    product.is_unlimited
                      ? undefined
                      : product.product_amount
                  }
                  disabled={outOfStock}
                  value={quantities[product.product_id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.product_id]: Number(e.target.value),
                    })
                  }
                  className="w-20 border rounded-xl text-center text-black bg-white py-2"
                />
              </div>

              {/* Botón */}
              <div className="flex justify-center mt-4">
                <button
                  disabled={outOfStock}
                  onMouseEnter={() => setHoveredId(product.product_id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    handleAddToCart(
                      product,
                      quantities[product.product_id] || 1
                    )
                  }
                  className={`w-full py-4 rounded-2xl text-white text-lg font-medium transition-all duration-300 ${outOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : hoveredId === product.product_id
                        ? "bg-green-600 scale-105"
                        : "bg-black"
                    }`}
                >
                  {outOfStock
                    ? "Agotado"
                    : hoveredId === product.product_id
                      ? "Agregar al carrito 🛒"
                      : "Seleccionar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 w-full flex justify-center px-4 z-50">
          <button
            onClick={handleFinish}
            className="w-full max-w-md bg-black text-white py-4 rounded-2xl text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300"
          >
            Finalizar compra ({cartCount})
          </button>
        </div>
      )}
    </div>
  );
}

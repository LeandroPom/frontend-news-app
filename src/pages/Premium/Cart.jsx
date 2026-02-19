import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [quantities, setQuantities] = useState({});

  const user = useSelector((state) => state.posts.user);
  const user_id = user?.user_id;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setTimeout(() => setAnimate(true), 100);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      const productsFromBack = Array.isArray(data.data) ? data.data : [];
      setProducts(productsFromBack);
    } catch (error) {
      console.error("Error trayendo productos:", error);
    }
  };

  // 🔥 Precio final con descuento
  const getFinalPrice = (product) => {
    return product.discount_active
      ? product.product_price -
      (product.product_price * product.discount_percent) / 100
      : product.product_price;
  };

  const handleAddToCart = (product, quantity = 1) => {
    if (!user_id)
      return Swal.fire("Error", "Debes iniciar sesión", "error");

    if (!product.is_unlimited && product.product_amount <= 0)
      return Swal.fire("Sin stock", "Producto agotado", "warning");

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) => item.product_id === product.product_id
    );

    const finalPrice = getFinalPrice(product);

    if (existingIndex !== -1) {
      const newQty = existingCart[existingIndex].quantity + quantity;

      if (
        !product.is_unlimited &&
        newQty > product.product_amount
      ) {
        return Swal.fire(
          "Stock insuficiente",
          "No hay suficiente cantidad disponible",
          "warning"
        );
      }

      existingCart[existingIndex].quantity = newQty;
    } else {
      existingCart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        product_img: product.product_img, // 🔥 IMPORTANTE
        price: finalPrice,
        quantity,
        type: product.product_name.toLowerCase(),
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);

    setQuantities({
      ...quantities,
      [product.product_id]: 1,
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Producto agregado",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = [...cart];
    const item = updatedCart[index];

    // 🔥 Buscar el producto real para saber el stock
    const product = products.find(
      (p) => p.product_id === item.product_id
    );

    if (!product) return;

    // 🔥 Validación real de stock
    if (
      !product.is_unlimited &&
      newQuantity > product.product_amount
    ) {
      return Swal.fire(
        "Stock insuficiente",
        `Solo hay ${product.product_amount} unidades disponibles`,
        "warning"
      );
    }

    item.quantity = newQuantity;

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    return cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      if (!user_id)
        return Swal.fire("Error", "Debes iniciar sesión", "error");

      const orderResponse = await axios.post("/orders", {
        user_id,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });

      const purchase_id = orderResponse.data.purchase_id;

      const paymentResponse = await axios.post("/payments/create", {
        purchase_id,
      });

      window.location.href = paymentResponse.data.init_point;
    } catch (error) {
      Swal.fire("Error en el pago", "Algo salió mal", "error");
    }
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 py-16 transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-12 text-center">
          Tu Carrito
        </h2>

        {/* ---------------- CARRITO VACÍO ---------------- */}
        {cart.length === 0 && (
          <>
            <div className="text-center text-gray-600 mb-10">
              Tu carrito está vacío. Agrega un producto para comenzar.
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {products.map((product) => {
                const finalPrice = getFinalPrice(product);
                const outOfStock =
                  !product.is_unlimited && product.product_amount <= 0;

                return (
                  <div
                    key={product.product_id}
                    className="border rounded-2xl p-6 flex flex-col justify-between relative"
                  >
                    {product.discount_active && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{product.discount_percent}%
                      </span>
                    )}
                    {product.product_img && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={product.product_img}
                          alt={product.product_name}
                          className="w-24 h-24 object-contain rounded-xl"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-2">
                        {product.product_name}
                      </h4>

                      {product.discount_active ? (
                        <>
                          <p className="text-2xl font-bold text-black">
                            ${finalPrice.toFixed(2)}
                          </p>
                          <p className="text-gray-400 line-through text-sm">
                            ${product.product_price}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-black mb-4">
                          ${product.product_price}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 mt-4 text-black">
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
                        className="w-24 border rounded-xl text-center py-2 text-black"
                      />

                      <button
                        disabled={outOfStock}
                        onClick={() =>
                          handleAddToCart(
                            product,
                            quantities[product.product_id] || 1
                          )
                        }
                        className={`py-3 rounded-xl font-medium transition-all duration-300 ${outOfStock
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800 active:scale-95"
                          }`}
                      >
                        {outOfStock ? "Agotado" : "Agregar al carrito"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ---------------- CARRITO CON PRODUCTOS ---------------- */}
        {cart.length > 0 && (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                {/* Imagen */}
                {item.product_img && (
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.product_img}
                      alt={item.product_name}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-medium text-black">
                    {item.product_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-4 text-black">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      updateQuantity(index, Number(e.target.value))
                    }
                    className="w-20 border rounded-xl text-center"
                  />

                  <p className="font-semibold text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-black"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t pt-8 flex justify-between">
              <h3 className="text-xl sm:text-2xl font-semibold text-black">
                Total
              </h3>
              <h3 className="text-xl sm:text-2xl font-semibold text-black">
                ${getTotal()}
              </h3>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-black text-white py-4 rounded-2xl"
            >
              Continuar al Pago
            </button>

            <button
              onClick={() => setShowProducts(true)}
              className="w-full mt-4 bg-black text-white py-4 rounded-2xl"
            >
              Ver más productos
            </button>
            {showProducts && (
              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                {products.map((product) => {
                  const finalPrice = getFinalPrice(product);
                  const outOfStock =
                    !product.is_unlimited && product.product_amount <= 0;

                  return (
                    <div
                      key={product.product_id}
                      className="border rounded-2xl p-6 flex flex-col justify-between relative"
                    >
                      {product.discount_active && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          -{product.discount_percent}%
                        </span>
                      )}
                      {product.product_img && (
                        <div className="flex justify-center mb-4">
                          <img
                            src={product.product_img}
                            alt={product.product_name}
                            className="w-24 h-24 object-contain rounded-xl"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-black mb-2">
                          {product.product_name}
                        </h4>

                        {product.discount_active ? (
                          <>
                            <p className="text-2xl font-bold text-black">
                              ${finalPrice.toFixed(2)}
                            </p>
                            <p className="text-gray-400 line-through text-sm">
                              ${product.product_price}
                            </p>
                          </>
                        ) : (
                          <p className="text-2xl font-bold text-black mb-4">
                            ${product.product_price}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 mt-4 text-black">
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
                          className="w-24 border rounded-xl text-center py-2 text-black"
                        />

                        <button
                          disabled={outOfStock}
                          onClick={() =>
                            handleAddToCart(
                              product,
                              quantities[product.product_id] || 1
                            )
                          }
                          className={`py-3 rounded-xl transition ${outOfStock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black text-white"
                            }`}
                        >
                          {outOfStock ? "Agotado" : "Agregar al carrito"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

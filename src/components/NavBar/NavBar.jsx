import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/postsActions";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// 🇦🇷 Letras animadas
const AnimatedLetters = ({ text }) => (
  <span className="inline-block">
    {text.split("").map((char, index) => (
      <motion.span
        key={index}
        className="inline-block font-extrabold"
        style={{
          background: "linear-gradient(90deg, #00bfff, #ffffff, #00bfff)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
        animate={{
          y: [0, -4, 0],
          backgroundPosition: ["0% center", "200% center"],
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
            delay: index * 0.08,
          },
          backgroundPosition: {
            repeat: Infinity,
            duration: 2.5,
            ease: "linear",
            delay: index * 0.05,
          },
        }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.posts.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="text-white shadow-md backdrop-blur-md fixed top-0 left-0 w-full z-50"
      style={{
        backgroundColor: "rgba(18, 51, 95, 0.6)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0 select-none">
            <h1 className="text-2xl font-extrabold tracking-wide">
              <AnimatedLetters text="Palabra Argentina" />
            </h1>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex space-x-6 items-center">
            {!user ? (
              <Link
                to="/login"
                className="hover:text-red-400 transition-colors font-medium"
              >
                Acceder
              </Link>
            ) : (
              <>
                {/* 🛒 CARRITO (ANTES DE PREMIUM) */}
                <Link
                  to="/cart"
                  className="hover:text-sky-300 transition"
                >
                  <FaShoppingCart size={22} />
                </Link>

                {/* PREMIUM */}
                <Link
                  to="/Premium"
                  className="font-bold text-sky-400"
                >
                  Premium/Productos
                </Link>

                <Link
                  to="/mis-favoritos"
                  className="hover:text-yellow-300 transition font-medium"
                >
                  ❤️ Mis Favoritos
                </Link>

                <div className="flex items-center space-x-2">
                  <FaUserCircle size={24} />
                  <Link
                    to="/Miperfil"
                    className="hover:text-sky-400 transition font-medium"
                  >
                    Mi Perfil
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              to="/contacto"
              className="hover:text-sky-300 transition-colors font-medium"
            >
              Contáctanos
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[rgba(18,51,95,0.95)] border-t border-white/20 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-3 space-y-3">
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-red-400 font-medium"
                >
                  Acceder
                </Link>
              ) : (
                <>
                  {/* 🛒 CARRITO MOBILE */}
                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-sky-300 font-medium"
                  >
                    <FaShoppingCart size={18} /> Carrito
                  </Link>

                  <Link
                    to="/Premium"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-bold text-sky-400"
                  >
                    Premium/Productos
                  </Link>

                  <Link
                    to="/mis-favoritos"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-yellow-300 font-medium"
                  >
                    ❤️ Mis Favoritos
                  </Link>

                  <Link
                    to="/Miperfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-sky-400 font-medium"
                  >
                    <FaUserCircle size={20} /> Mi Perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left hover:text-red-400 font-medium"
                  >
                    Logout
                  </button>
                </>
              )}

              <Link
                to="/contacto"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-sky-300 font-medium"
              >
                Contáctanos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

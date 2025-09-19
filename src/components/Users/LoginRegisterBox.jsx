// LoginRegisterBox.jsx
import React, { useState } from "react";

const LoginRegisterBox = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#12335F] p-4">
      <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
        
        {/* Panel Login */}
        <div
          className="flex-1 p-8 flex flex-col justify-center text-white transition-all duration-500"
          style={{
            backgroundColor: isLogin
              ? "rgba(62, 139, 226, 0.67)"  // activo: oscuro y opaco
              : "rgba(6, 13, 24, 0.95)", // inactivo: muy transparente
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <h2 className="text-3xl  font-bold mb-6">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
          />
          <button className="bg-[#215caa] hover:bg-[#1B4A8A] py-2 rounded font-bold transition-colors">
            Entrar
          </button>
          <p className="mt-4 text-sm">
            No tienes cuenta?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="text-white font-bold underline"
            >
              Registrarse
            </button>
          </p>
        </div>

        {/* Panel Register */}
        <div
          className="flex-1 p-8 flex flex-col justify-center text-white transition-all duration-500"
          style={{
            backgroundColor: isLogin
              ? "rgba(6, 13, 24, 0.2)" // inactivo: muy transparente
              : "rgba(62, 139, 226, 0.67)", // activo: oscuro y opaco
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <h2 className="text-3xl font-bold mb-6">Register</h2>
          <input
            type="text"
            placeholder="Nombre"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
          />
          <button className="bg-[#215caa] hover:bg-[#1B4A8A] py-2 rounded font-bold transition-colors">
            Registrarse
          </button>
          <p className="mt-4 text-sm">
            Ya tienes cuenta?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="text-white font-bold underline"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterBox;

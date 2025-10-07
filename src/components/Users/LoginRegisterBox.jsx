// LoginRegisterBox.jsx
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import axios from "axios";
import GoogleButton from "react-google-button";
import { login } from "../../redux/actions/postsActions"; // <-- tu acción Redux
import Swal from "sweetalert2"; // ✅ importamos sweetalert2
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Firebase/firebase.config"; // tu configuración de Firebase

const LoginRegisterBox = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ user_name: "", mail: "", password: "" });

  // 🔹 Estados para animación de botones
  const [loginStage, setLoginStage] = useState("idle"); // idle | loading | success
  const [registerStage, setRegisterStage] = useState("idle"); // idle | loading | success

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.posts.user);
  const authError = useSelector((state) => state.posts.authError);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Register normal con animación
  const handleRegister = async () => {
    setRegisterStage("loading");
    try {
      const { data } = await axios.post("/auth/register", form);

      setTimeout(() => {
        setRegisterStage("success");
        setTimeout(() => {
          setRegisterStage("idle");
          Swal.fire("Registro exitoso", data.message, "success");
        }, 1000);
      }, 2000);
    } catch (err) {
      setRegisterStage("idle");
      Swal.fire(
        "Error",
        err.response?.data?.error || "Error en registro",
        "error"
      );
    }
  };

  // 🔹 Register con Google
  const handleRegisterGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const randomPass = Math.random().toString(36).slice(-10);

      const { data } = await axios.post("/auth/register", {
        user_name: user.displayName || "Usuario Google",
        mail: user.email,
        password: randomPass,
      });

      Swal.fire("Registro con Google", data.message, "success");
    } catch (err) {
      Swal.fire("Error", "Error registrando con Google", "error");
    }
  };

  // 🔹 Login normal con animación
  const handleLogin = () => {
    setLoginStage("loading");

    setTimeout(() => {
      setLoginStage("success");
      setTimeout(() => {
        dispatch(login({ mail: form.mail, password: form.password }));
        setLoginStage("idle");
      }, 1000);
    }, 2000);
  };

  // ⚡ Efecto que dispara SweetAlert y redirige cuando login es exitoso
  useEffect(() => {
    if (user) {
    
        navigate("/home");
     
    }
  }, [user, navigate]);

  // ⚡ Efecto que dispara SweetAlert si hay error
  useEffect(() => {
    if (authError && !user) {
      Swal.fire("Error", authError, "error");
    }
  }, [authError, user]);

  // 🔹 Login con Google
  const handleLoginGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const randomPass = Math.random().toString(36).slice(-10);

      const { data } = await axios.post("/auth/login", {
        mail: user.email,
        password: randomPass,
      });

      Swal.fire({
        title: "Login con Google exitoso",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/home");
      });
    } catch (err) {
      Swal.fire("Error", "Error en login con Google", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#12335F] p-4">
      <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
        {/* Panel Login */}
        <div
          onClick={() => setIsLogin(true)}
          className="flex-1 p-8 flex flex-col justify-center text-white transition-all duration-500 cursor-pointer"
          style={{
            backgroundColor: isLogin
              ? "rgba(62, 139, 226, 0.67)"
              : "rgba(6, 13, 24, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <input
            type="mail"
            name="mail"
            placeholder="Email"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
            disabled={!isLogin}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
            disabled={!isLogin}
            onChange={handleChange}
          />
          <button
            onClick={handleLogin}
            className={`bg-[#215caa] py-2 rounded font-bold transition-colors mb-2 flex justify-center items-center gap-2 ${
              loginStage === "loading" ? "opacity-80 cursor-wait" : "hover:bg-[#1B4A8A]"
            }`}
            disabled={!isLogin || loginStage === "loading"}
          >
            {loginStage === "idle" && "Entrar"}
            {loginStage === "loading" && (
              <span className="flex items-center">
                Entrando<span className="ml-2 animate-pulse">...</span>
              </span>
            )}
            {loginStage === "success" && (
              <span className="flex items-center gap-2">✅ OK</span>
            )}
          </button>

          <GoogleButton
            label="Ingresar con Google"
            style={{ width: "100%" }}
            onClick={handleLoginGoogle}
            disabled={!isLogin || loginStage === "loading"}
          />

          <p className="mt-4 text-sm">
            No tienes cuenta?{" "}
            <span
              onClick={() => setIsLogin(false)}
              className="text-white font-bold underline cursor-pointer"
            >
              Registrarse
            </span>
          </p>
        </div>

        {/* Panel Register */}
        <div
          onClick={() => setIsLogin(false)}
          className="flex-1 p-8 flex flex-col justify-center text-white transition-all duration-500 cursor-pointer"
          style={{
            backgroundColor: isLogin
              ? "rgba(6, 13, 24, 0.2)"
              : "rgba(62, 139, 226, 0.67)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <h2 className="text-3xl font-bold mb-6">Register</h2>
          <input
            type="text"
            name="user_name"
            placeholder="Nombre de usuario"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
            disabled={isLogin}
            onChange={handleChange}
          />
          <input
            type="mail"
            name="mail"
            placeholder="Email"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
            disabled={isLogin}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4 p-2 rounded bg-white/20 text-black placeholder-black"
            disabled={isLogin}
            onChange={handleChange}
          />
          <button
            onClick={handleRegister}
            className={`bg-[#215caa] py-2 rounded font-bold transition-colors mb-2 flex justify-center items-center gap-2 ${
              registerStage === "loading" ? "opacity-80 cursor-wait" : "hover:bg-[#1B4A8A]"
            }`}
            disabled={isLogin || registerStage === "loading"}
          >
            {registerStage === "idle" && "Registrarse"}
            {registerStage === "loading" && (
              <span className="flex items-center">
                Registrando<span className="ml-2 animate-pulse">...</span>
              </span>
            )}
            {registerStage === "success" && (
              <span className="flex items-center gap-2">✅ OK</span>
            )}
          </button>

          <GoogleButton
            label="Registrarse con Google"
            style={{ width: "100%" }}
            onClick={handleRegisterGoogle}
            disabled={isLogin || registerStage === "loading"}
          />

          <p className="mt-4 text-sm">
            Ya tienes cuenta?{" "}
            <span
              onClick={() => setIsLogin(true)}
              className="text-white font-bold underline cursor-pointer"
            >
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterBox;

import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const { data } = await axios.post("/auth/login", credentials);
    const user = jwtDecode(data.token);

    // 🚫 Bloquear usuarios inactivos
    if (user.active === false) {
      return dispatch({
        type: "LOGIN_FAILURE",
        payload: "Tu cuenta está desactivada. Contacta al administrador.",
      });
    }

    localStorage.setItem("token", data.token);
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token: data.token, user },
    });
  } catch (err) {
    dispatch({
      type: "LOGIN_FAILURE",
      payload: err.response?.data?.error || "Error en login",
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: "LOGOUT" });
};

// -------- POSTS --------
export const getMostViewedPosts = () => async (dispatch) => {
  dispatch({ type: "GET_POSTS_REQUEST" });

  try {
    const { data } = await axios.get("/posts/most-viewed");
    dispatch({ type: "GET_POSTS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "GET_POSTS_FAILURE", payload: err.message });
  }
};
// -------- USERS (Admin Panel) --------

// 🧩 Obtener todos los usuarios
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: "FETCH_USERS_REQUEST" });
  try {
    const { data } = await axios.get("/users");
    dispatch({ type: "FETCH_USERS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "FETCH_USERS_FAILURE",
      payload: err.response?.data?.error || err.message,
    });
  }
};

// 🔍 Buscar usuarios por nombre
export const searchUsers = (name) => async (dispatch) => {
  dispatch({ type: "SEARCH_USERS_REQUEST" });
  try {
    const { data } = await axios.get(`/users/search?name=${name}`);
    dispatch({ type: "SEARCH_USERS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "SEARCH_USERS_FAILURE",
      payload: err.response?.data?.error || err.message,
    });
  }
};

// 🔄 Activar / desactivar usuario
export const toggleUserActive = (id, currentState) => async (dispatch) => {
  try {
    await axios.patch(`/users/${id}/active`, { state: !currentState });
    dispatch(fetchUsers());
  } catch (err) {
    console.error("Error al cambiar estado del usuario:", err);
  }
};

// 🗑 Eliminar usuario
export const deleteUser = (id) => async (dispatch) => {
  if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
  try {
    await axios.delete(`/users/${id}`);
    dispatch(fetchUsers());
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
  }
};

// ✏️ Editar usuario
export const editUser = (id, editData) => async (dispatch) => {
  try {
    // 🧹 Filtramos campos vacíos antes de enviar al backend
    const cleanData = { ...editData };
    if (!cleanData.password) delete cleanData.password;

    await axios.put(`/users/admin/${id}`, cleanData);
    dispatch(fetchUsers());
  } catch (err) {
    console.error("Error al editar usuario:", err);
  }
};

// -------- POSTS --------

// Traer todos los posts
export const fetchPosts = () => async (dispatch) => {
  try {
    dispatch({ type: "GET_POSTS_REQUEST" });

    const { data } = await axios.get("/posts");

    dispatch({ type: "GET_POSTS_SUCCESS", payload: data });
    // console.log("Posts desde backend:", data);
  } catch (err) {
    dispatch({
      type: "GET_POSTS_FAILURE",
      payload: err.response?.data?.error || "Error al traer posts",
    });
  }
};

// Buscar posts por nombre
export const searchPosts = (name) => async (dispatch) => {
  try {
    dispatch({ type: "GET_POSTS_REQUEST" });

    const { data } = await axios.get(`/posts/search?name=${name}`);

    dispatch({ type: "GET_POSTS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GET_POSTS_FAILURE",
      payload: err.response?.data?.error || "Error buscando posts",
    });
  }
};

//// Editar post ////
export const editPost = (post_id, updates) => async (dispatch) => {
  try {
    dispatch({ type: "EDIT_POST_REQUEST" });

    // Enviar solo campos modificados
    const payload = {};
    ["headLine", "lead", "body", "conclusion", "active"].forEach((key) => {
      if (updates[key] !== undefined) payload[key] = updates[key];
    });

    const { data } = await axios.put(`/posts/${post_id}`, payload);

    dispatch({ type: "EDIT_POST_SUCCESS", payload: data });
    dispatch(fetchPosts()); // refrescar lista
  } catch (err) {
    dispatch({
      type: "EDIT_POST_FAILURE",
      payload: err.response?.data?.error || "Error editando post",
    });
  }
};

// Alternar estado activo
export const togglePostActive = (post_id, currentState) => async (dispatch) => {
  try {
    dispatch({ type: "TOGGLE_POST_REQUEST" });

    const { data } = await axios.patch(`/posts/${post_id}/active`, { state: !currentState });

    dispatch({ type: "TOGGLE_POST_SUCCESS", payload: data });
    dispatch(fetchPosts()); // refrescar lista
  } catch (err) {
    dispatch({
      type: "TOGGLE_POST_FAILURE",
      payload: err.response?.data?.error || "Error cambiando estado del post",
    });
  }
};

// Eliminar post
export const deletePost = (post_id) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_POST_REQUEST" });

    const { data } = await axios.delete(`/posts/${post_id}`);

    dispatch({ type: "DELETE_POST_SUCCESS", payload: post_id });
    dispatch(fetchPosts()); // refrescar lista
  } catch (err) {
    dispatch({
      type: "DELETE_POST_FAILURE",
      payload: err.response?.data?.error || "Error eliminando post",
    });
  }
};


import axios from "axios";
import { jwtDecode } from "jwt-decode";

// -------- AUTH --------
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const { data } = await axios.post("/auth/login", credentials);

    localStorage.setItem("token", data.token);
    const user = jwtDecode(data.token);
console.log(user, " datos de usuario desde la action")
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token: data.token, user },
    });
    console.log(token, " token desde actions")
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

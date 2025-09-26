import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem("token");

const initialState = {
  allPosts: [],
  postsLoading: false,
  postsError: null,

  token: token || null,
  user: token ? jwtDecode(token) : null,
  authLoading: false,
  authError: null,
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    // -------- POSTS --------
    case "GET_POSTS_REQUEST":
      return { ...state, postsLoading: true, postsError: null };
    case "GET_POSTS_SUCCESS":
      return { ...state, postsLoading: false, allPosts: action.payload };
    case "GET_POSTS_FAILURE":
      return { ...state, postsLoading: false, postsError: action.payload };

    // -------- AUTH --------
    case "LOGIN_REQUEST":
      return { ...state, authLoading: true, authError: null };
    case "LOGIN_SUCCESS":
  return {
    ...state,
    authLoading: false,
    token: action.payload.token,
    user: action.payload.user,
    authError: null, // ✅ reseteamos error
  };
    case "LOGIN_FAILURE":
      return { ...state, authLoading: false, authError: action.payload };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        user: null,
        authLoading: false,
        authError: null,
      };

    default:
      return state;
  }
};

export default postsReducer;

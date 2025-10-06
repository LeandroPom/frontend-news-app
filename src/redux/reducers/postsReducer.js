import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

const initialState = {
  // -------- POSTS --------
  allPosts: [],
  postsLoading: false,
  postsError: null,

  // -------- AUTH --------
  token: token || null,
  user: token ? jwtDecode(token) : null,
  authLoading: false,
  authError: null,

  // -------- USERS (Admin Panel) --------
  users: [],
  usersLoading: false,
  usersError: null,
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

    case "EDIT_POST_REQUEST":
    case "TOGGLE_POST_REQUEST":
    case "DELETE_POST_REQUEST":
      return { ...state, postsLoading: true, postsError: null };

    case "EDIT_POST_SUCCESS":
    case "TOGGLE_POST_SUCCESS":
    case "DELETE_POST_SUCCESS":
      return { ...state, postsLoading: false, postsError: null };

    case "EDIT_POST_FAILURE":
    case "TOGGLE_POST_FAILURE":
    case "DELETE_POST_FAILURE":
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
        authError: null,
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

    // -------- USERS (Admin Panel) --------
    case "FETCH_USERS_REQUEST":
    case "SEARCH_USERS_REQUEST":
      return { ...state, usersLoading: true, usersError: null };

    case "FETCH_USERS_SUCCESS":
    case "SEARCH_USERS_SUCCESS":
      return { ...state, usersLoading: false, users: action.payload };

    case "FETCH_USERS_FAILURE":
    case "SEARCH_USERS_FAILURE":
      return { ...state, usersLoading: false, usersError: action.payload };

    default:
      return state;
  }
};

export default postsReducer;

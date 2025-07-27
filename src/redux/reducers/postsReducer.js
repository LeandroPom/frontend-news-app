const initialState = {
  allPosts: [],
  loading: false,
  error: null
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_POSTS_REQUEST':
      return { ...state, loading: true };
    case 'GET_POSTS_SUCCESS':
      return { ...state, loading: false, allPosts: action.payload };
    case 'GET_POSTS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default postsReducer;

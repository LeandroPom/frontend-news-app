import axios from '../../api/axiosConfig';

export const getMostViewedPosts = () => async (dispatch) => {
  dispatch({ type: 'GET_POSTS_REQUEST' });

  try {
    const response = await axios.get('/posts/most-viewed');
    dispatch({ type: 'GET_POSTS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'GET_POSTS_FAILURE', payload: error.message });
  }
};

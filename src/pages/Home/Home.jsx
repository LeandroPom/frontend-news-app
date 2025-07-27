// Home.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMostViewedPosts } from '../../redux/actions/postsActions';

export default function Home() {

  const dispatch = useDispatch();
  const { allPosts, loading, error } = useSelector(state => state.posts);

  useEffect(() => {
    dispatch(getMostViewedPosts());
  }, [dispatch]);

  if (loading) return <p>Cargando publicaciones...</p>;
  if (error) return <p>Error al cargar publicaciones: {error}</p>;

  return (
    <div>
      <h1>Publicaciones más vistas SAPE</h1>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>Vistas: {post.views}</p>
            <p>{post.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

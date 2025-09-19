import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
import Post from './components/Posts/Post';
import LoginRegisterBox from './components/Users/LoginRegisterBox';
import CreatePost from './components/Posts/CreatePost';

// import NavBar from './components/NavBar/NavBar';

function App() {
  const location = useLocation();
 
  
  return (
    <div className="App">
      {/* Si querés ocultar la NavBar solo en landing: */}
      {/* {location.pathname !== '/' && <NavBar />} */}

      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/Post' element={<Post />} />
        <Route path='/Login' element={<LoginRegisterBox />} />
        <Route path='/Create' element={<CreatePost />} />
      </Routes>
    </div>
  );
}

export default App;

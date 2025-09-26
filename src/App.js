import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
import Post from './components/Posts/Post';
import LoginRegisterBox from './components/Users/LoginRegisterBox';
import CreatePost from './components/Posts/CreatePost';
import axios from 'axios';
import SidebarBusqueda from './pages/Searchs/SidebarBusqueda';
import Busqueda from './pages/Searchs/SidebarBusqueda';
import TagSelector from './components/Posts/TagSelector';
import UserProfile from './components/Users/UserProfile';
import AdminPanel from './components/Administration/AdminPanel';

// import NavBar from './components/NavBar/NavBar';

axios.defaults.baseURL = "http://localhost:3001/";

function App() {
  const location = useLocation();
 
  
  return (
    <div className="App">
      {/* Si querés ocultar la NavBar solo en landing: */}
      {/* {location.pathname !== '/' && <NavBar />} */}

      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/post/:id' element={<Post />} />
        <Route path='/Login' element={<LoginRegisterBox />} />
        <Route path='/Create' element={<CreatePost />} />
        <Route path='/Busqueda' element={<Busqueda />} />
        <Route path='/creartag' element={<TagSelector />} />
         <Route path='/Miperfil' element={<UserProfile />} />
         <Route path='/Administration' element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

export default App;

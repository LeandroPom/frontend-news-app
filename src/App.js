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
import AdminLayout from './components/Administration/AdminLayout';
import SidebarPublicidad from './pages/Home/SidebarPublicidad';
import BannerManager from './components/Administration/BannerManager';
import AdminUserPanel from './components/Administration/AdminUserPanel';
import AdminPostPanel from './components/Administration/AdminPostPanel';
import Noticias from './pages/Noticias';

// import NavBar from './components/NavBar/NavBar';

axios.defaults.baseURL = "http://localhost:3001/";

function App() {
  const location = useLocation();
 
  
  return (
    <div className="App">
      {/* Si querés ocultar la NavBar solo en landing: */}
      {/* {location.pathname !== '/' && <NavBar />} */}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/post/:id' element={<Post />} />
        <Route path='/Login' element={<LoginRegisterBox />} />
        <Route path='/Create' element={<CreatePost />} />
        <Route path='/Busqueda' element={<Busqueda />} />
        <Route path='/creartag' element={<TagSelector />} />
        <Route path='/banner' element={<BannerManager />} />
        <Route path="/noticias" element={<Noticias />} />
         <Route path='/Miperfil' element={<UserProfile />} />
           {/* Rutas del admin */}
  <Route path='/Administration' element={<AdminLayout />}>
    <Route index element={<AdminPanel />} />   {/* Bienvenida */}
    <Route path='create' element={<CreatePost />} />
    <Route path='creartag' element={<TagSelector />} />
    <Route path='banner' element={<BannerManager />} />
    <Route path='Userpanel' element={<AdminUserPanel />} />
    <Route path='Postpanel' element={<AdminPostPanel />} />
  </Route>
</Routes>
    </div>
  );
}

export default App;

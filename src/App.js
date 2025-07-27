import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
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
      </Routes>
    </div>
  );
}

export default App;

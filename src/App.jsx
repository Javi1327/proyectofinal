import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import CargaAlumnos from './components/CargaAlumnos';
import './App.css';
import Footer from './Pages/Home/Footer';

const App = () => {
  return (
      < BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/carga-alumnos" element={<CargaAlumnos />} />
          </Routes>
        <Footer/>
      </BrowserRouter>
  );
};

export default App;

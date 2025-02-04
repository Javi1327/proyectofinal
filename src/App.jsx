import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import CargaAlumnos from './components/CargaAlumnos';
import Footer from './Pages/Home/Footer';
import { UserProvider } from './context/UserContext'; // Corregida la ruta (elimina 'src')
import ProfesorView from './pages/ProfesorView';
import SubirNotas from './components/SubirNotas';
import './App.css';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/carga-alumnos" element={<CargaAlumnos />} />
          <Route path="/profesor" element={<ProfesorView />} />
          <Route path="/profesor/subir-notas" element={<SubirNotas />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

// src/components/Home.jsx
import React from 'react';
import Header from '../Pages/Home/Header';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/carga-alumnos');
  };

  return (
    <div>
      <Header/>
      <h2>Página de Inicio</h2>
      <p>¡Bienvenido a la página de inicio!</p>
      <button onClick={handleNavigate}>Carga de Alumnos</button>
    </div>
  );
};

export default Home;
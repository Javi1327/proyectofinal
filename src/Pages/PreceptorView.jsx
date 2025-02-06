// src/Pages/PreceptorView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PreceptorView.css';

const PreceptorView = () => {
  const navigate = useNavigate();

  const handleNavigate = (funcion) => {
    navigate(`/preceptor/${funcion}`);
  }

  return (
    <div className='preceptor-view'>
      <h2>Bienvenido, Preceptor</h2>
      <div className='botones-container'>
      <button onClick={() => handleNavigate('cargar-alumnos')} className="funcion-btn">
        Cargar Alumnos
      </button>
      <button onClick={() => handleNavigate('ver-alumnos')} className="funcion-btn">
        Ver Alumnos
      </button>
      <button onClick={() => handleNavigate('ver-cursos')} className="funcion-btn">
        Ver Cursos 
      </button>
      <button onClick={() => handleNavigate('Dar-asistencias')} className="funcion-btn">
        Dar Asistencias
      </button>
      </div>

    </div>
  );
};

export default PreceptorView;

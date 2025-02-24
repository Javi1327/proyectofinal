// src/components/ProfesorView.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfesorView.css'; // Asegúrate de importar el CSS

const ProfesorView = () => {
  const navigate = useNavigate();

  // Función para redirigir a las vistas correspondientes
  const handleNavigate = (funcion) => {
    navigate(`/profesor/${funcion}`);
  };

  return (
    <div className="profesor-view">
      <h2>Bienvenido, Profesor</h2>
      <div className="botones-container">
        <button onClick={() => handleNavigate('subir-notas')} className="funcion-btn">
          Subir Notas
        </button>
        <button onClick={() => handleNavigate('ver-notas')} className="funcion-btn">
          Ver Notas
        </button>
        <button onClick={() => handleNavigate('ver-cursos')} className="funcion-btn">
          Ver Cursos
        </button>
        <button onClick={() => handleNavigate('tareas-profesor')} className="funcion-btn">
          Subir/Ver Tareas
        </button>
      </div>
    </div>
  );
};

export default ProfesorView;



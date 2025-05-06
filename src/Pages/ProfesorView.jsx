import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate
import './ProfesorView.css';

const ProfesorView = () => {
  const navigate = useNavigate(); // Crear la función de navegación

  return (
    <div className="profesor-view">
      <h2>Bienvenido, Profesor</h2>

      <div className="botones-container">
        <button
          className="funcion-btn"
          onClick={() => navigate('/profesor/subir-notas')} // Redirige a la ruta correspondiente
        >
          Subir Notas
        </button>
        <button
          className="funcion-btn"
          onClick={() => navigate('/profesor/cursos-notas')} // Redirige a la ruta correspondiente
        >
          Mis Cursos
        </button>
        <button
          className="funcion-btn"
          onClick={() => navigate('/profesor/tareas')} // Redirige a la ruta correspondiente
        >
          Tareas del Curso
        </button>
      </div>
    </div>
  );
};

export default ProfesorView;

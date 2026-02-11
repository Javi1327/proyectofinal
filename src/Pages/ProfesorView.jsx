import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate
import './ProfesorView.css';

const ProfesorView = () => {
  const navigate = useNavigate(); // Crear la función de navegación

  return (
    <div className="profesor-view">
      <h2>Bienvenido, Profesor</h2>

      <div className="botones-container">
        {/* Botón unificado para gestionar notas (subir, editar, eliminar) */}
        <button
          className="funcion-btn"
          onClick={() => navigate('/profesor/gestion-notas')} // Nueva ruta para el componente unificado
        >
          Gestionar Notas
        </button>
        <button onClick={() => navigate('/profesor/ver-asistencia')} className="funcion-btn">
        Ver Asistencias
        </button>
      </div>
    </div>
  );
};

export default ProfesorView;

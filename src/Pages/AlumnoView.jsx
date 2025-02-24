import React from "react";
import { useNavigate } from "react-router-dom";
import "./AlumnoView.css";

const AlumnoView = () => {
  const navigate = useNavigate();

  const handleNavigate = (ruta) => {
    navigate(`/alumno/${ruta}`);
  };

  return (
    <div className="alumno-view">
      <h2>Bienvenido, Alumno</h2>
      <div className="botones-container">
        <button onClick={() => handleNavigate("ver-notas")} className="funcion-btn">
          Ver Notas
        </button>
        <button onClick={() => handleNavigate("ver-asistencia")} className="funcion-btn">
          Ver Asistencia
        </button>
        <button onClick={() => handleNavigate("tareas-alumno")} className="funcion-btn">
          Entregar / Descargar Tareas
        </button>
        <button onClick={() => handleNavigate("foro")} className="funcion-btn">
          Foro del Curso
        </button>
      </div>
    </div>
  );
};

export default AlumnoView;

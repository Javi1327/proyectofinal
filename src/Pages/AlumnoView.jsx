/*import React from "react";
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
      </div>
    </div>
  );
};

export default AlumnoView; */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import "./AlumnoView.css";

const AlumnoView = () => {
  const navigate = useNavigate();
  const { user, role } = useUser();

  if (role !== 'alumno') {
    navigate('/');
    return null;
  }

  const handleNavigate = (ruta) => {
    navigate(`/alumno/${ruta}`);
  };

  return (
    <div className="alumno-view">
      <h2>Bienvenido, {user?.nombre || "Alumno"}</h2>
      <div className="botones-container">
        <button onClick={() => handleNavigate("ver-notas")} className="funcion-btn">
          Ver Notas
        </button>
        <button onClick={() => handleNavigate("ver-asistencia")} className="funcion-btn">
          Ver Asistencia
        </button>
        <button onClick={() => handleNavigate("ver-calendario")} className="funcion-btn">
          Ver calendario académico
        </button>
        {/* Agrega más botones si quieres */}
      </div>
    </div>
  );
};

export default AlumnoView;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminView.css';

const AdminView = () => {
  const navigate = useNavigate();

const handleNavigate = (ruta) => {
  navigate(`/admin/${ruta}`);
}

return (
    <div className="admin-view">
      <h2>Bienvenido, Administrador</h2>
      <div className="botones-container">
        <button onClick={() => handleNavigate("crear-usuario")} className="funcion-btn">
          Crear Usuario
        </button>
        <button onClick={() => handleNavigate("ver-usuarios")} className="funcion-btn">
          Ver / Modificar / Eliminar Usuarios  
        </button>
        <button onClick={() => handleNavigate("crear-materias")} className="funcion-btn">
          Crear Materias
        </button>
        <button onClick={() => handleNavigate("asignar-cursos")} className="funcion-btn">
          Asignar Cursos
        </button>
      </div>
    </div>
  );
};

export default AdminView;


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
        <button onClick={() => handleNavigate("administrar-usuarios")} className="funcion-btn">
          Administrar Usuarios (Crear, Modificar, Eliminar y Ver) 
        </button>
        <button onClick={() => handleNavigate("crear-materias")} className="funcion-btn">
          Crear Materias
        </button>
      </div>
    </div>
  );
};

export default AdminView;


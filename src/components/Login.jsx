import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginAsAlumno, loginAsProfesor, loginAsPreceptor } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // Estado para el rol seleccionado
  const [formData, setFormData] = useState({ username: '', password: '' }); // Estado para los datos del formulario

  const handleRoleSelect = (role) => {
    setSelectedRole(role); // Muestra el formulario después de seleccionar el rol
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'alumno') {
      loginAsAlumno();
    } else if (selectedRole === 'profesor') {
      loginAsProfesor();
    } else if (selectedRole === 'preceptor') {
      loginAsPreceptor();
    }
    navigate('/home'); // Redirigir al Home después de iniciar sesión
  };

  return (
    <div className="login-container">
      <div className="header-bienvenida">
        <h1>Bienvenidos al Sistema de Gestión de Alumnos</h1>
        <h2>Por favor inicie sesión</h2>
      </div>

      {!selectedRole ? (
        <div className="button-container">
          <button onClick={() => handleRoleSelect('alumno')}>Login como Alumno</button>
          <button onClick={() => handleRoleSelect('profesor')}>Login como Profesor</button>
          <button onClick={() => handleRoleSelect('preceptor')}>Login como Preceptor</button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <h3>Inicio de sesión como {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h3>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Iniciar Sesión</button>
          <button type="button" className="back-button" onClick={() => setSelectedRole(null)}>
            Volver
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;




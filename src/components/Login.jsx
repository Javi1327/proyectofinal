/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    // Aquí podrías agregar la lógica de validación más adelante
    e.preventDefault()
    if(username.length > 0 && password.length > 0){
      navigate('/home'); // Redirigir a la página de inicio
    }else{
      alert("complete los campos para iniciar sesion.")
    }
  };

  return (
    <> 
    <div className="HeaderBienvenida">
      <h1>Bienvenidos al Sistema de Gestion de Alumnos</h1>
      <h2>Por favor inicie sesion</h2>
    </div> 
    <div className="contenedorLogin">
        <form className='form'>
            <h2>Iniciar Sesión</h2>
            <div className="input">
                <label htmlFor="usuario" className="label">Usuario</label>
                <input
                    type="text"
                    id='usuario'
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input">
                <label htmlFor="contraseña" className="label">Contraseña</label>  
                <input
                    type="password"
                    id='contraseña'
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
 
        <button className="boton" onClick={handleLogin}>Iniciar Sesión</button>
        </form>
    </div>
    </>
  );
};

export default Login;
*/

// src/components/Login.jsx
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




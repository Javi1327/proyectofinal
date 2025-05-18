import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginAsAlumno, loginAsProfesor, loginAsPreceptor, loginAsAdmin } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // Estado para el rol seleccionado
  const [formData, setFormData] = useState({ username: '', password: '' });  //Estado para los datos del formulario
  const [error, setError] = useState(''); // Estado para manejar errores
 
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      if (selectedRole === 'alumno') {
        // Aquí deberías hacer la llamada a tu API para autenticar al alumno
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/loginAlumno`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.username, // Nombre del alumno
            dni: formData.password, // DNI como contraseña
          }),
        });

        if (!response.ok) {
          throw new Error('Nombre de alumno o DNI incorrectos.');
        }

        const data = await response.json();
        // Extraer accesstoken, refreshtoken y alumnoId
        const { accesstoken, refreshtoken, id } = data.data;
        console.log("el id del alumno es ", id)
        // Almacena los tokens en el almacenamiento local
        localStorage.setItem('accesstoken', accesstoken);
        localStorage.setItem('refreshtoken', refreshtoken);

        // Almacena el ID, nombre y DNI en el estado o contexto
        loginAsAlumno(id, formData.username, formData.password); // Llama a la función de login con el ID del estudiante

      } else if (selectedRole === 'profesor') {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/loginProfesor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.username, // Nombre del profesor
            dni: formData.password, // DNI como contraseña
          }),
        });

        if (!response.ok) {
          throw new Error('Nombre de profesor o DNI incorrectos.');
        }

        const data = await response.json();
        // Extraer accesstoken, refreshtoken y ProfesorId
        const { accesstoken, refreshtoken, id } = data.data;
        console.log("el id del alumno es ", id)
        // Almacena los tokens en el almacenamiento local
        localStorage.setItem('accesstoken', accesstoken);
        localStorage.setItem('refreshtoken', refreshtoken);

        loginAsProfesor(id, formData.username, formData.password);

      } else if (selectedRole === 'preceptor') {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/loginPreceptor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.username, // Nombre del preceptor
            dni: formData.password, // DNI como contraseña
          }),
        });

        if (!response.ok) {
          throw new Error('Nombre de preceptor o DNI incorrectos.');
        }

        const data = await response.json();
        // Extraer accesstoken, refreshtoken y preceptorId
        const { accesstoken, refreshtoken, id } = data.data;
        console.log("el id del alumno es ", id)
        // Almacena los tokens en el almacenamiento local
        localStorage.setItem('accesstoken', accesstoken);
        localStorage.setItem('refreshtoken', refreshtoken);

        loginAsPreceptor(id, formData.username, formData.password);

      } else if (selectedRole === 'admin') {
        const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/loginAdmin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.username, // Nombre del preceptor
            dni: formData.password, // DNI como contraseña
          }),
        });

        if (!response.ok) {
          throw new Error('Nombre de preceptor o DNI incorrectos.');
        }

        const data = await response.json();
        // Extraer accesstoken, refreshtoken y preceptorId
        const { accesstoken, refreshtoken, id } = data.data;
        console.log("el id del alumno es ", id)
        // Almacena los tokens en el almacenamiento local
        localStorage.setItem('accesstoken', accesstoken);
        localStorage.setItem('refreshtoken', refreshtoken);

        loginAsAdmin(id, formData.username, formData.password);
      }

      navigate('/home'); // Redirigir al Home después de iniciar sesión
    } catch (error) {
      setError(error.message); // Manejo de errores
    }
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
          <button onClick={() => handleRoleSelect('admin')}>Login como Administrador</button>
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
            placeholder="DNI"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Iniciar Sesión</button>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores */}
          <button type="button" className="back-button" onClick={() => setSelectedRole(null)}>
            Volver
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;


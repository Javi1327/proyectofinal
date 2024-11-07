import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí podrías agregar la lógica de validación más adelante
    navigate('/home'); // Redirigir a la página de inicio
  };

  return (
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
  );
};

export default Login;
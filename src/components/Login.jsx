import React, { useState } from 'react';
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
    <h1>Bien venidos al sistema de gestion de alunos</h1>
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
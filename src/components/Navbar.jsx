import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Home, Settings } from "lucide-react";  // Agrega Settings
import { useUser } from "../context/UserContext";
import ChangePassword from './ChangePassword';  // Agrega import
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, loginAsAlumno, loginAsProfesor, loginAsPreceptor, loginAsAdmin } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);  // Nuevo estado para dropdown
  const [showChangePassword, setShowChangePassword] = useState(false);  // Nuevo estado para modal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos.');
      }

      const data = await response.json();
      const { accesstoken, refreshtoken, role, id, nombre, dni } = data.data;

      localStorage.setItem('accesstoken', accesstoken);
      localStorage.setItem('refreshtoken', refreshtoken);

      if (role === 'alumno') loginAsAlumno(id, nombre, dni);
      else if (role === 'profesor') loginAsProfesor(id, nombre, dni);
      else if (role === 'preceptor') loginAsPreceptor(id, nombre, dni);
      else if (role === 'admin') loginAsAdmin(id, nombre, dni);

      setShowModal(false);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Si no hay usuario y estamos en "/", muestra navbar con botón "Acceder"
  if (!user && location.pathname === "/") {
    return (
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-title">Sistema de Gestión de Alumnos</span>
        </div>
        <div className="navbar-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Acceder</button>
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Iniciar Sesión</h3>
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <input type="text" name="username" placeholder="Usuario (ej. alumno, profesor, preceptor, admin)" value={formData.username} onChange={handleInputChange} required />
                <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} required />
                <button type="submit">Iniciar Sesión</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </form>
              <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Si no hay usuario en otras rutas, no mostrar navbar
  if (!user) return null;

  // Navbar normal para usuarios logueados
  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/home')}>
        <Home className="navbar-home-icon" />
      </div>
      <div className="navbar-center">
        <span className="navbar-username">Hola, {user?.nombre || "Usuario"}</span>
      </div>
      <div className="navbar-right">
        <User className="navbar-icon" onClick={() => navigate('/perfil')} />
        <Settings className="navbar-icon" onClick={toggleSettings} />  {/* Nuevo ícono Settings */}
        <LogOut className="navbar-icon" onClick={handleLogout} />
        {showSettings && (  // Dropdown de ajustes
          <ul className="settings-dropdown">
            <li onClick={() => { setShowChangePassword(true); setShowSettings(false); }}>Cambiar Contraseña</li>
            <li>nuevo ajuste</li>
            <li>nuevo ajuste</li>
            {/* Agrega más opciones aquí, ej. <li>Otra Opción</li> */}
          </ul>
        )}
      </div>
      {showChangePassword && <ChangePassword onClose={() => setShowChangePassword(false)} />}  {/* Modal */}
    </nav>
  );
};

export default Navbar;
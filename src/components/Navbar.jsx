import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, User, Settings, LogOut, MessageCircle, Home } from "lucide-react";
import { useUser } from "../context/UserContext";
import "./Navbar.css";
//import Perfil from "./Perfil";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ubicación actual

  // Verifica si la ruta es /login, si lo es, no renderices el Navbar
  if (location.pathname === "/") {
    return null; // No renderiza nada si está en la página de login
  }

  // funcion para serrar secion y salir
  const handleLogout = () => {
    // Eliminar token o datos de sesión
    localStorage.removeItem('token'); // ajusta la clave si usas otra
    // Redirigir a la página principal o login
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/home')}>
        <Home className="navbar-home-icon" />
      </div>
      <div className="navbar-center">
        <span className="navbar-username">Hola, {user?.name || "Usuario"}</span>
      </div>
      <div className="navbar-right">
        <MessageCircle className="navbar-icon" onClick={() => navigate('/alumno/foro')} />
        <User className="navbar-icon" onClick={() => navigate('/perfil')} />
        <Settings className="navbar-icon" onClick={() => navigate('/configuraciones')} />
        <LogOut className="navbar-icon" onClick={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Home } from "lucide-react"; // Removí MessageCircle y Settings de los imports
import { useUser } from "../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
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
        {/* Removí MessageCircle (foro) y Settings (configuraciones) */}
        <User className="navbar-icon" onClick={() => navigate('/perfil')} />
        <LogOut className="navbar-icon" onClick={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ChangePassword from './ChangePassword';

export default function Home() {
  const { role } = useUser();  // Quita logout
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    console.log('role:', role);
    if (!role) return;

    const timer = setTimeout(() => {
      switch (role) {
        case 'alumno':
          navigate('/alumno/home');
          break;
        case 'profesor':
          navigate('/profesor/home');
          break;
        case 'preceptor':
          navigate('/preceptor/home');
          break;
        case 'admin':
          navigate('/admin/home');
          break;
        default:
          console.error('Tipo de usuario no reconocido');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [role, navigate]);

  if (!role) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <header style={{ padding: '20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Sistema de Gestión de Alumnos</h1>
        {/* Quita el div con botones */}
      </header>
      <p>Redirigiendo a tu panel...</p>
      {/* Quita el modal si no lo quieres aquí */}
    </div>
  );
}
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser  } from '../context/UserContext';

export default function Home() {
  const { userType } = useUser ();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('userType:', userType);
    if (!userType) return;

    switch(userType) {
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
  }, [userType, navigate]);

  if (!userType) {
    return <div>Cargando...</div>;
  }

  // Opcional: mientras navega, puedes mostrar algo o nada
  return null;
}


/*
// src/components/Home.jsx
import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Corrección en la ruta
import AlumnoView from "../pages/AlumnoView";
import ProfesorView from "../pages/ProfesorView";
import PreceptorView from "../pages/PreceptorView";
import AdminView from '../Pages/AdminView';

export default function Home() {
  const { userType } = useUser();
 
  return (
    <div className="p-4">
      {userType === 'alumno' && <AlumnoView />}
      {userType === 'profesor' && <ProfesorView />}
      {userType === 'preceptor' && <PreceptorView />}
      {userType === 'admin' && <AdminView />}
    </div>
  );
}
*/
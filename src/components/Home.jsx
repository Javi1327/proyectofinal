// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Corrección en la ruta
import AlumnoView from "../pages/AlumnoView";
import ProfesorView from "../pages/ProfesorView";
import PreceptorView from "../pages/PreceptorView";
import AdminView from '../Pages/AdminView';

export default function Home() {
  const { userType } = useUser();
  const navigate = useNavigate();

  if (!userType) {
    return <div>Cargando...</div>; // O redirigir al login si es necesario
  }

  return (
    <div className="p-4">
      {userType === 'alumno' && <AlumnoView />}
      {userType === 'profesor' && <ProfesorView />}
      {userType === 'preceptor' && <PreceptorView />}
      {userType === 'admin' && <AdminView />}
    </div>
  );
}
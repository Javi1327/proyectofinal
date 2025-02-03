// src/components/Home.jsx
import React from 'react';
import Header from '../Pages/Home/Header';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Corrección en la ruta
import AlumnoView from "../pages/AlumnoView";
import ProfesorView from "../pages/ProfesorView";
import PreceptorView from "../pages/PreceptorView";

export default function Home() {
  const { userType } = useUser();
  const navigate = useNavigate();

  if (!userType) {
    return <div>Cargando...</div>; // O redirigir al login si es necesario
  }

  return (
    <div className="p-4">
      <Header />
      {userType === 'alumno' && <AlumnoView />}
      {userType === 'profesor' && <ProfesorView />}
      {userType === 'preceptor' && <PreceptorView />}
    </div>
  );
}
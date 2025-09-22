import React from 'react';
import { useUser  } from '../context/UserContext';  // Corregí espacio extra
import PerfilPreceptor from './PerfilPreceptor';
import PerfilAdmin from './PerfilAdmin';
import PerfilProfesor from './perfilProfesor';  // Corregí mayúscula (ajusta si tu archivo es 'perfilProfesor.jsx')
import PerfilAlumno from './PerfilAlumno';   

const Perfil = () => {
  const { userId, alumnoId, userType } = useUser ();

  // DEBUG: Agrega esto temporalmente para ver valores en consola
  console.log('Contexto en Perfil:', { userId, alumnoId, userType });

  // LÓGICA CORREGIDA: Verifica que haya ID válido SEGÚN el tipo
  // Para 'alumno': chequea alumnoId
  // Para otros: chequea userId
  // También chequea userType
  const hasValidId = userType && (userType === 'alumno' ? !!alumnoId : !!userId);
  
  if (!hasValidId) {
    return <p>No hay usuario logueado o tipo de usuario inválido. Debug: {userType}, ID: {userType === 'alumno' ? alumnoId : userId}</p>;
  }

  switch (userType) {
    case 'preceptor':
      return <PerfilPreceptor userId={userId} />;  // Pasa userId si lo necesita (ajusta si usa contexto)
    case 'alumno':
      return <PerfilAlumno alumnoId={alumnoId} />;  // Pasa alumnoId (aunque lo saque de contexto, es backup)
    case 'profesor':
      return <PerfilProfesor userId={userId} />;
    case 'admin':
      return <PerfilAdmin userId={userId} />;
    default:
      return <p>Tipo de usuario no reconocido: "{userType}" (debe ser exactamente 'alumno', etc.)</p>;
  }
};

export default Perfil;
// src/context/UserContext.jsx
import React, { createContext, useContext, useState } from "react";

// Crear un contexto para el usuario
const UserContext = createContext();

// Crear el proveedor del contextoÑ
export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // Estado para el tipo de usuario
  const [alumnoId, setAlumnoId] = useState(null); // Estado para el ID del alumno
  const [nombre, setNombre] = useState(null);
  const [dni, setDni] = useState(null);

  // Funciones de login
  const loginAsAlumno = (id, nombreAlumno, dniAlumno) => {
    setUserType("alumno");
    setAlumnoId(id); // Establecer el ID del alumno al iniciar sesión
    setNombre(nombreAlumno); // Almacenar el nombre
    setDni(dniAlumno); // Almacenar el DNI
  };
  
  // Esta función es solo un ejemplo para simular el login
  const loginAsProfesor = () => setUserType("profesor");
  const loginAsPreceptor = () => setUserType("preceptor");

  return (
    <UserContext.Provider value={{ userType, alumnoId, loginAsAlumno, loginAsProfesor, loginAsPreceptor }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useUser = () => useContext(UserContext);


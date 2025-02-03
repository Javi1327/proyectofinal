// src/context/UserContext.jsx
import React, { createContext, useContext, useState } from "react";

// Crear un contexto para el usuario
const UserContext = createContext();

// Crear el proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // Estado para el tipo de usuario

  // Esta función es solo un ejemplo para simular el login
  const loginAsAlumno = () => setUserType("alumno");
  const loginAsProfesor = () => setUserType("profesor");
  const loginAsPreceptor = () => setUserType("preceptor");

  return (
    <UserContext.Provider value={{ userType, loginAsAlumno, loginAsProfesor, loginAsPreceptor }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useUser = () => useContext(UserContext);


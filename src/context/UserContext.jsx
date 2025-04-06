import React, { createContext, useContext, useState } from "react";

// Crear un contexto para el usuario
export const UserContext = createContext();

// Crear el proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // Tipo de usuario (admin, profesor, preceptor, alumno)
  const [userId, setUserId] = useState(null); // ID del usuario (alumno, profesor, etc.)
  const [nombre, setNombre] = useState(null);
  const [dni, setDni] = useState(null);
  const [email, setEmail] = useState(null); // Para profesores/admins
  
  // Función para iniciar sesión con diferentes roles
  const loginUser = (role, id, nombreUsuario, dniUsuario, emailUsuario = null) => {
    setUserRole(role);
    setUserId(id);
    setNombre(nombreUsuario);
    setDni(dniUsuario);
    setEmail(emailUsuario);
  };

  return (
    <UserContext.Provider value={{ userRole, userId, nombre, dni, email, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useUser = () => useContext(UserContext);





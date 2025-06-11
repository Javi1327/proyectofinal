import React, { createContext, useContext, useState } from "react";

// Crear un contexto para el usuario
export const UserContext = createContext();

// Crear el proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // Estado para el tipo de usuario
  const [alumnoId, setAlumnoId] = useState(null); // Estado para el ID del alumno
  const [userId, setUserId] = useState(null);  // ID del usuario (profesor, preceptor, etc.)
  const [nombre, setNombre] = useState(null);
  const [dni, setDni] = useState(null);
  
  // Función para iniciar sesión con diferentes roles
  const loginAsAlumno = (id, nombreAlumno, dniAlumno) => {
    setUserType("alumno");
    setAlumnoId(id); // Establecer el ID del alumno al iniciar sesión
    setNombre(nombreAlumno); // Almacenar el nombre
    setDni(dniAlumno); // Almacenar el DNI
  };
 
  const loginAsProfesor = (id, nombreProfesor, dniProfesor) => {
    setUserType("profesor");
    setUserId(id); // Establecer el ID del profesor al iniciar sesión
    setNombre(nombreProfesor); // Almacenar el nombre
    setDni(dniProfesor); // Almacenar el DNI
  };

  const loginAsPreceptor = (id, nombrePrrceptor, dniPreceptor) => {
    setUserType("preceptor");
    setUserId(id); // Establecer el ID del alumno al iniciar sesión
    setNombre(nombrePrrceptor); // Almacenar el nombre
    setDni(dniPreceptor); // Almacenar el DNI
  };

  const loginAsAdmin = (id, nombreAdmin, dniAdmin) => {
    setUserType("admin");
    setUserId(id); // Establecer el ID del alumno al iniciar sesión
    setNombre(nombreAdmin); // Almacenar el nombre
    setDni(dniAdmin); // Almacenar el DNI
  };

  return (
    // Agregue userId, nombre y dni al contexto
<UserContext.Provider value={{ userType, alumnoId, userId, nombre, dni, loginAsAlumno, loginAsProfesor, loginAsPreceptor, loginAsAdmin }}>   
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useUser = () => useContext(UserContext);

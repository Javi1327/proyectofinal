 /*
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
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const accesstoken = localStorage.getItem('accesstoken');
    if (accesstoken) {
      try {
        const decoded = jwtDecode(accesstoken);
        setUser({ id: decoded.id, nombre: decoded.nombre, dni: decoded.dni });
        setRole(decoded.role);
      } catch (error) {
        console.log('Token inválido:', error);
        localStorage.removeItem('accesstoken');
        localStorage.removeItem('refreshtoken');
      }
    }
  }, []);

  const loginAsAlumno = (id, nombre, dni) => {
    setUser({ id, nombre, dni });
    setRole('alumno');
    localStorage.setItem('userRole', 'alumno');
    localStorage.setItem('userId', id);
    localStorage.setItem('userNombre', nombre);
    localStorage.setItem('userDni', dni);
  };

  const loginAsProfesor = (id, nombre, dni) => {
    setUser({ id, nombre, dni });
    setRole('profesor');
    localStorage.setItem('userRole', 'profesor');
    localStorage.setItem('userId', id);
    localStorage.setItem('userNombre', nombre);
    localStorage.setItem('userDni', dni);
  };

  const loginAsPreceptor = (id, nombre, dni) => {
    setUser({ id, nombre, dni });
    setRole('preceptor');
    localStorage.setItem('userRole', 'preceptor');
    localStorage.setItem('userId', id);
    localStorage.setItem('userNombre', nombre);
    localStorage.setItem('userDni', dni);
  };

  const loginAsAdmin = (id, nombre, dni) => {
    setUser({ id, nombre, dni });
    setRole('admin');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userId', id);
    localStorage.setItem('userNombre', nombre);
    localStorage.setItem('userDni', dni);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const accesstoken = localStorage.getItem('accesstoken');
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accesstoken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) throw new Error('Error al cambiar contraseña');
    return await response.json();
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('userDni');
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{
      user, role, loginAsAlumno, loginAsProfesor, loginAsPreceptor, loginAsAdmin, changePassword, logout
    }}>
      {children}
    </UserContext.Provider>
  );
};
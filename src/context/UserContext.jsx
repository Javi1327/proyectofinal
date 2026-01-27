import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /*useEffect(() => {
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
  }, []);*/

  useEffect(() => {
    const verificarSesion = () => {
      const accesstoken = localStorage.getItem('accesstoken');
      
      if (accesstoken) {
        try {
          const decoded = jwtDecode(accesstoken);
          
          // VALIDACIÓN: Verificar si el token expiró
          const ahora = Date.now() / 1000; // Tiempo actual en segundos
          if (decoded.exp < ahora) {
            console.warn("Sesión expirada");
            logout(); // Si expiró, limpiamos todo
          } else {
            // Token válido: Seteamos usuario
            setUser({ id: decoded.id, nombre: decoded.nombre, dni: decoded.dni });
            setRole(decoded.role);
          }
        } catch (error) {
          console.error('Token corrupto o inválido:', error);
          logout();
        }
      } else {
        // No hay token: Aseguramos que el estado esté vacío
        setUser(null);
        setRole(null);
      }
      setLoading(false); // Terminó de verificar
    };

    verificarSesion();
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
      user, role, loading, loginAsAlumno, loginAsProfesor, loginAsPreceptor, loginAsAdmin, changePassword, logout
    }}>
      {!loading && children} 
    </UserContext.Provider>
  );
};
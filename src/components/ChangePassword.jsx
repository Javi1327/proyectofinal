import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';  // Agrega este import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = ({ onClose }) => {
  const { changePassword } = useUser();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validaciones
  if (formData.newPassword.length > 20) {
    toast.error('La nueva contraseña no puede tener más de 20 caracteres.');
    return;
  }
  if (formData.newPassword !== formData.confirmPassword) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  try {
    let token = localStorage.getItem('accesstoken');
    
    // Refresh si expiró
    if (token && jwtDecode(token).exp * 1000 < Date.now()) {
      console.log('Token expirado, intentando refrescar...');
      const refreshResponse = await fetch(`${import.meta.env.VITE_URL_BACK}login/token`, {
        method: 'POST',
        headers: { 'x-refresh-token': localStorage.getItem('refreshtoken') }
      });
      
      if (refreshResponse.ok) {
        const result = await refreshResponse.json();
        const newAccessToken = result.data.accesstoken; 
        
        if (newAccessToken) {
          localStorage.setItem('accesstoken', newAccessToken);
          token = newAccessToken;
          console.log('Token refrescado con éxito');
        }
      } else {
        throw new Error('Sesión expirada. Por favor, inicia sesión de nuevo.');
      }
    }

    // Logs para el token
    console.log('Token final a usar:', token);
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      console.log('Token expira en:', new Date(decoded.exp * 1000));
      console.log('Ahora es:', new Date());
    } catch (decodeError) {
      console.error('Error decodificando token:', decodeError);
      toast.error('Token corrupto. Inicia sesión de nuevo.');
      return;
    }

    // Fetch para cambiar contraseña
    const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }),
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      // 1. Mensaje de éxito
      toast.success('¡Contraseña cambiada con éxito! Por seguridad, inicia sesión nuevamente.');

      // 2. Limpiamos los tokens para que la sesión vieja se cierre
      setTimeout(() => {
        localStorage.removeItem('accesstoken');
        localStorage.removeItem('refreshtoken');
        
        // 3. Cerramos el modal y recargamos o redirigimos
        onClose(); 
        window.location.href = '/'; // Ajusta esta ruta a tu página de login
      }, 2500); // Damos tiempo a que lea el toast

    } else {
      // Tu lógica de errores está bien, solo asegúrate de leer el JSON una sola vez
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Error al cambiar contraseña';

      if (response.status === 401 || response.status === 400) {
        toast.error('Su contraseña actual es incorrecta.');
      } else if (response.status === 403) {
        toast.error(`Sesión inválida: ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }
    }
  } catch (err) {
    console.error("Error completo:", err);
    toast.error(err.message || 'Error inesperado');
  }
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Cambiar Contraseña</h3>
        <form onSubmit={handleSubmit}>
          <input type="password" name="currentPassword" placeholder="Contraseña actual" onChange={handleChange} required />
          <input type="password" name="newPassword" placeholder="Nueva contraseña (máximo 20 caracteres)" maxLength="20" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmar nueva contraseña" onChange={handleChange} required />
          <button type="submit">Cambiar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
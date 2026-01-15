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
    
    // Validación: Nueva contraseña debe tener máximo 20 caracteres
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
      
      // Verifica si el token expiró (exp * 1000 es timestamp en ms)
      if (token && jwtDecode(token).exp * 1000 < Date.now()) {
        console.log('Token expirado, intentando refrescar...');
        const refreshResponse = await fetch(`${import.meta.env.VITE_URL_BACK}login/token`, {
          method: 'POST',
          headers: { 'x-refresh-token': localStorage.getItem('refreshtoken') }
        });
        
        if (refreshResponse.ok) {
          const { accesstoken } = await refreshResponse.json();
          localStorage.setItem('accesstoken', accesstoken);
          token = accesstoken;
          console.log('Token refrescado exitosamente');
        } else {
          throw new Error('Token expirado. Reloguéate para continuar.');
        }
      }

      // Ahora envía la petición con el token válido
      const response = await fetch(`${import.meta.env.VITE_URL_BACK}login/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Contraseña cambiada exitosamente');
        onClose();
      } else {
        // Si es 401 (no autorizado, asumiendo contraseña incorrecta), mostrar mensaje personalizado
        if (response.status === 401) {
          toast.error('Su contraseña actual es incorrecta. Ingrese su contraseña bien.');
        } else {
          // Para otros errores (cuando todo está bien pero hay un problema no relacionado con la contraseña), mostrar "Error al cambiar contraseña"
          toast.error('Error al cambiar contraseña');
        }
      }
    } catch (err) {
      toast.error(err.message);
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
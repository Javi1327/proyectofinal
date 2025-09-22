import React, { useState, useEffect } from 'react';
import { useUser  } from '../context/UserContext';

const PerfilProfesor = () => {
  const backurl = import.meta.env.VITE_URL_BACK;
  const { userId } = useUser ();
  const [user, setUser ] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ 
       nombre: '', 
       apellido: '', 
       dni: '',  
       correoElectronico: '',
       telefono: '', });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !backurl) return;

    setLoading(true);
    const url = `${backurl.replace(/\/$/, '')}/profesores/${userId}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener usuario');
        return res.json();
      })
      .then(response => {
        const userData = response.data;
        setUser ({
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          correoElectronico: userData.correoElectronico,
          telefono: userData.telefono
        });
        setFormData({
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          correoElectronico: userData.correoElectronico,
          telefono: userData.telefono
        });
        setEditMode(false);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar el perfil');
      })
      .finally(() => setLoading(false));
  }, [userId, backurl]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!userId || !backurl) return;

    setLoading(true);

    fetch(`${backurl.replace(/\/$/, '')}/profesores/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar perfil');
        return res.json();
      })
      .then(response => {
        const userData = response.data;
        setUser ({
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          correoElectronico: userData.correoElectronico,
          telefono: userData.telefono
        });
        setFormData({
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          correoElectronico: userData.correoElectronico,
          telefono: userData.telefono
        });
        setEditMode(false);
        setError(null);
        alert('Perfil actualizado correctamente');
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo actualizar el perfil');
        alert('Error al actualizar el perfil');
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return null;

  const hasChanges = 
    formData.nombre !== user.nombre || 
    formData.apellido !== user.apellido ||
    formData.dni !== user.dni ||
    formData.correoElectronico !== user.correoElectronico ||
    formData.telefono !== user.telefono;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Perfil de Profesor: {user.nombre}</h2>
      {editMode ? (
        <div>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            autoComplete="name"
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          />
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            autoComplete="apellido"
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          />
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="DNI"
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          />
          <input
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleChange}
            placeholder="Correo electrónico"
            autoComplete="email"
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          />
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          />
          <button onClick={handleSave} disabled={!hasChanges || loading} style={{ margin: '5px' }}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setFormData({ 
                nombre: user.nombre, 
                apellido: user.apellido, 
                dni: user.dni,
                correoElectronico: user.correoElectronico,
                telefono: user.telefono
              });
              setError(null);
            }}
            disabled={loading}
            style={{ margin: '5px' }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Apellido:</strong> {user.apellido}</p>
          <p><strong>DNI:</strong> {user.dni}</p>
          <p><strong>Correo electrónico:</strong> {user.correoElectronico}</p>   
          <p><strong>Teléfono:</strong> {user.telefono}</p>

          <button onClick={() => setEditMode(true)} style={{ margin: '5px' }}>Editar perfil</button>
        </div>
      )}
    </div>
  );
};

export default PerfilProfesor;
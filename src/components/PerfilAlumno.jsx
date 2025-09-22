import React, { useState, useEffect } from 'react';
import { useUser  } from '../context/UserContext';  

const PerfilAlumno = ({ alumnoId: propAlumnoId }) => {  // AGREGADO: Recibe prop como fallback
  const backurl = import.meta.env.VITE_URL_BACK;
  const { alumnoId: contextAlumnoId } = useUser ();
  const alumnoId = propAlumnoId || contextAlumnoId;  // Usa prop si existe, sino del contexto

  const [user, setUser ] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    apellido: '', 
    dni: '', 
    direccion: '', 
    telefono: '', 
    correoElectronico: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('alumnoId en PerfilAlumno:', alumnoId);  // DEBUG: Verifica si llega el ID
    if (!alumnoId || !backurl) {
      console.log('No hay alumnoId o backurl');  // DEBUG
      return;
    }

    setLoading(true);
    const url = `${backurl.replace(/\/$/, '')}/alumnos/${alumnoId}`;
    console.log('Fetch URL:', url);  // DEBUG: Verifica la URL

    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        console.log('Respuesta fetch:', res.status);  // DEBUG
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(response => {
        console.log('Datos recibidos:', response);  // DEBUG
        const userData = response.data;
        setUser ({
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          direccion: userData.direccion,
          telefono: userData.telefono,
          correoElectronico: userData.correoElectronico
        });
        setFormData({
          nombre: userData.nombre,
          apellido: userData.apellido,
          dni: userData.dni,
          direccion: userData.direccion,
          telefono: userData.telefono,
          correoElectronico: userData.correoElectronico
        });
        setEditMode(false);
        setError(null);
      })
      .catch(err => {
        console.error('Error en fetch:', err);  // DEBUG mejorado
        setError('No se pudo cargar el perfil: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, [alumnoId, backurl]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Cargando perfil del alumno...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>No se encontraron datos del alumno. Verifica el ID.</p>;  // Mejor que null

  return (
    <div style={{ padding: '20px' }}>
      <h2>Perfil de Alumno: {user.nombre}</h2>
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
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            style={{ margin: '5px', padding: '5px', width: '200px' }}
          />
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Direccion"
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
        </div>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Apellido:</strong> {user.apellido}</p>
          <p><strong>DNI:</strong> {user.dni}</p>
          <p><strong>Teléfono:</strong> {user.telefono}</p>
          <p><strong>Direccion:</strong> {user.direccion}</p>
          <p><strong>Correo electrónico:</strong> {user.correoElectronico}</p>   
        </div>
      )}
    </div>
  );
};

export default PerfilAlumno;
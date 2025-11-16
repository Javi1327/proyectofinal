import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import './VerAlumnos.css';

const VerAlumnos = () => {

  const backurl = import.meta.env.VITE_URL_BACK;

  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alumnoToEdit, setAlumnoToEdit] = useState(null);
  const [Nombre, setNombre] = useState('');
  const [Apellido, setApellido] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Dni, setDni] = useState("");
  const [Telefono, setTelefono] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [FechaNacimiento, setFechaNacimiento] = useState('');
  const [Grado, setGrado] = useState(''); // Cambiado a string para simplificar, pero ajusta si es objeto
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('apellido');
  const [sortAsc, setSortAsc] = useState(true);

  // Cargar datos desde la API
  useEffect(() => {
    obtenerAlumnos();
    obtenerCursos();
  }, []);

  const obtenerAlumnos = async () => {
    try {
      const response = await fetch(`${backurl}alumnos`);
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result); // Verificamos la estructura de los datos
      //setAlumnos(data);
      console.log(result.data)
      setAlumnos(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Error al obtener los alumnos:', err);
      setAlumnos([]);
      alert('No se pudo cargar la lista de alumnos. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const obtenerCursos = async () => {
    try {
      const response = await fetch(`${backurl}cursos`); // Asume que tienes una ruta GET /cursos en el backend
      if (!response.ok) {
        throw new Error('Error al obtener cursos');
      }
      const result = await response.json();
      console.log('Respuesta de cursos:', result);
      setCursos(Array.isArray(result) ? result : []); 
    } catch (err) {
      console.error('Error al obtener cursos:', err);
      setCursos([]);
    }
  };


  // Función para eliminar alumno
  const eliminarAlumno = async (id) => {
    try {
      // Actualizamos el estado en el servidor usando PATCH
      //await axios.patch(`http://localhost:3001/alumnos/${id}`, { isHabilitado: false });
      const response = await fetch(`${backurl}alumnos/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
      }) 
      // Actualizamos el estado en el frontend
      //setAlumnos(alumnos.map(alumno =>
      //  alumno.id === id ? { ...alumno, isHabilitado: false } : alumno
      //));
      if (response.ok) {
        // Actualizamos el estado en el frontend
        setAlumnos(alumnos.filter(alumno => alumno._id !== id)); // Cambiado aquí
      } else {
        console.error('Error al eliminar el alumno:', response.statusText);
      }
    } catch (err) {
      console.error('Error al eliminar el alumno:', err);
    }
  };
  
  // Abrir modal de edición
  const openEditModal = (alumno) => {
    setAlumnoToEdit(alumno);
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setCorreo(alumno.correoElectronico);
    setDni(alumno.dni)
    setTelefono(alumno.telefono);
    setDireccion(alumno.direccion);
    setFechaNacimiento(alumno.fechaNacimiento);
    // Asumiendo que grado es un objeto con _id, ajusta si es necesario
    setGrado(alumno.grado?._id || ''); // Cambiado para usar _id si es objeto
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAlumnoToEdit(null);
  };

  // Función para guardar cambios (ahora envía al backend)
  const handleSave = async () => {
    if (!alumnoToEdit) return;

    const updatedAlumno = {
      nombre: Nombre,
      apellido: Apellido,
      correoElectronico: Correo,
      dni: Dni,
      telefono: Telefono,
      direccion: Direccion,
      fechaNacimiento: FechaNacimiento,
      grado: Grado, // Asumiendo que envías el _id del grado
    };

    try {
      const response = await fetch(`${backurl}alumnos/${alumnoToEdit._id}`, {
        method: 'PUT', // O PATCH, dependiendo de tu backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAlumno),
      });

      if (response.ok) {
        const result = await response.json();
        // Actualizar el estado local con los datos del servidor
        setAlumnos(alumnos.map(alumno =>
          alumno._id === alumnoToEdit._id ? { ...alumno, ...result.data } : alumno
        ));
        closeModal();
      } else {
        console.error('Error al actualizar el alumno:', response.statusText);
        alert('Error al guardar los cambios. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar los cambios. Inténtalo de nuevo.');
    }
  };

  // Filtrar alumnos habilitados y por búsqueda
  const filteredAlumnos = alumnos
    .filter(alumno => alumno.isHabilitado)
    .filter(alumno =>
      alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.grado.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Ordenar alumnos
  const sortedAlumnos = filteredAlumnos.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <h2>Lista de Alumnos</h2>

      <input
        type="text"
        placeholder="Buscar por Apellido o Grado"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('nombre')}>Nombre</th>
            <th onClick={() => toggleSort('apellido')}>Apellido</th>
            <th>Correo</th>
            <th>Dni</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha Nacimiento</th>
            <th>Grado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedAlumnos.map(alumno => (
            <tr key={alumno._id}> {/* Cambiado a _id para consistencia */}
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>{alumno.correoElectronico}</td>
              <td>{alumno.dni}</td>
              <td>{alumno.telefono}</td>
              <td>{alumno.direccion}</td>
             <td>{alumno.fechaNacimiento ? new Date(alumno.fechaNacimiento).toLocaleDateString('es-ES') : 'N/A'}</td> {/* Muestra "2025-06-04"  */}
              <td>{alumno.grado?.nombre || 'Sin grado asignado'}</td>
              <td>
                <button onClick={() => openEditModal(alumno)}>Editar</button>
                <button className='eliminar' onClick={() => eliminarAlumno(alumno._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Alumno</h3>
            <label>
              Nombre:
              <input type="text" value={Nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label>
              Apellido:
              <input type="text" value={Apellido} onChange={(e) => setApellido(e.target.value)} />
            </label>
            <label>
              Correo:
              <input type="email" value={Correo} onChange={(e) => setCorreo(e.target.value)} />
            </label>
            <label>
              Teléfono:
              <input type="text" value={Telefono} onChange={(e) => setTelefono(e.target.value)} />
            </label>
            <label>
              Dirección:
              <input type="text" value={Direccion} onChange={(e) => setDireccion(e.target.value)} />
            </label>
            <label>
              Dni:
              <input type="text" value={Dni} onChange={(e) => setDni(e.target.value)} />
            </label>
            <label>
              Fecha de Nacimiento:
              <input type="date" value={FechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}  max={new Date().toISOString().split("T")[0]} />
            </label>
            <label>
              Grado:
              {/* Cambiado a select para elegir de cursos */}
              <select value={Grado} onChange={(e) => setGrado(e.target.value)}>
                <option value="">Seleccionar Grado</option>
                {cursos.map(curso => (
                  <option key={curso._id} value={curso._id}>{curso.nombre}</option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSave}>Guardar</button>
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerAlumnos;
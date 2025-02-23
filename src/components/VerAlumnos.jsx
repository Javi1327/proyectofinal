import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VerAlumnos.css';

const VerAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alumnoToEdit, setAlumnoToEdit] = useState(null);
  const [Nombre, setNombre] = useState('');
  const [Apellido, setApellido] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [FechaNacimiento, setFechaNacimiento] = useState('');
  const [Grado, setGrado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('Apellido');
  const [sortAsc, setSortAsc] = useState(true);

  // Cargar datos desde la API
  useEffect(() => {
    obtenerAlumnos();
  }, []);

  const obtenerAlumnos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/alumnos');
      console.log(response.data); // Verificamos la estructura de los datos
      setAlumnos(response.data);
    } catch (err) {
      console.error('Error al obtener los alumnos:', err);
    }
  };

  // Función para eliminar alumno
  const eliminarAlumno = async (id) => {
    try {
      // Actualizamos el estado en el servidor usando PATCH
      await axios.patch(`http://localhost:3001/alumnos/${id}`, { isHabilitado: false });
  
      // Actualizamos el estado en el frontend
      setAlumnos(alumnos.map(alumno =>
        alumno.id === id ? { ...alumno, isHabilitado: false } : alumno
      ));
    } catch (err) {
      console.error('Error al eliminar el alumno:', err);
    }
  };
  
  // Abrir modal de edición
  const openEditModal = (alumno) => {
    setAlumnoToEdit(alumno);
    setNombre(alumno.Nombre);
    setApellido(alumno.Apellido);
    setCorreo(alumno.Correo);
    setTelefono(alumno.Telefono);
    setDireccion(alumno.Direccion);
    setFechaNacimiento(alumno.FechaNacimiento);
    setGrado(alumno.Grado);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAlumnoToEdit(null);
  };

  const handleSave = () => {
    setAlumnos(alumnos.map(alumno =>
      alumno.id === alumnoToEdit.id ? {
        ...alumno,
        Nombre,
        Apellido,
        Correo,
        Telefono,
        Direccion,
        FechaNacimiento,
        Grado
      } : alumno
    ));
    closeModal();
  };

  // Filtrar alumnos habilitados y por búsqueda
  const filteredAlumnos = alumnos
    .filter(alumno => alumno.isHabilitado)
    .filter(alumno =>
      alumno.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.Grado.toLowerCase().includes(searchTerm.toLowerCase())
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
            <th onClick={() => toggleSort('Nombre')}>Nombre</th>
            <th onClick={() => toggleSort('Apellido')}>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Fecha Nacimiento</th>
            <th>Grado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedAlumnos.map(alumno => (
            <tr key={alumno.id}>
              <td>{alumno.Nombre}</td>
              <td>{alumno.Apellido}</td>
              <td>{alumno.Correo}</td>
              <td>{alumno.Telefono}</td>
              <td>{alumno.Direccion}</td>
              <td>{alumno.FechaNacimiento}</td>
              <td>{alumno.Grado}</td>
              <td>
                <button onClick={() => openEditModal(alumno)}>Editar</button>
                <button onClick={() => eliminarAlumno(alumno.id)}>Eliminar</button>
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
              Fecha de Nacimiento:
              <input type="date" value={FechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
            </label>
            <label>
              Grado:
              <input type="text" value={Grado} onChange={(e) => setGrado(e.target.value)} />
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

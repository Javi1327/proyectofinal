import React, { useState, useEffect } from 'react';
import './VerAlumnos.css';

// Componente VerAlumnos
const VerAlumnos = () => {
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez', correo: 'juan@email.com', telefono: '1234567890', direccion: 'Calle Ficticia 123', fechaNacimiento: '2000-01-01', grado: '10', isHabilitado: true },
    { id: 2, nombre: 'Ana', apellido: 'García', correo: 'ana@email.com', telefono: '0987654321', direccion: 'Calle Imaginaria 456', fechaNacimiento: '2002-02-02', grado: '11', isHabilitado: true },
    { id: 3, nombre: 'Carlos', apellido: 'López', correo: 'carlos@email.com', telefono: '1122334455', direccion: 'Avenida Real 789', fechaNacimiento: '2001-03-03', grado: '12', isHabilitado: true },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alumnoToEdit, setAlumnoToEdit] = useState(null);
  
  const [Nombre, setNombre] = useState('');
  const [Apellido, setApellido] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [FechaNacimiento, setFechaNacimiento] = useState('');
  const [Grado, setGrado] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');  // Estado para almacenar la búsqueda
  const [sortField, setSortField] = useState('apellido'); // Campo para ordenar
  const [sortAsc, setSortAsc] = useState(true); // Estado para controlar el orden

  // Función para eliminar alumno
  const eliminarAlumno = (id) => {
    setAlumnos(alumnos.map(alumno => 
      alumno.id === id ? { ...alumno, isHabilitado: false } : alumno
    ));
  };

  // Abrir modal de edición
  const openEditModal = (alumno) => {
    setAlumnoToEdit(alumno);
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setCorreo(alumno.correo);
    setTelefono(alumno.telefono);
    setDireccion(alumno.direccion);
    setFechaNacimiento(alumno.fechaNacimiento);
    setGrado(alumno.grado);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setAlumnoToEdit(null);
  };

  // Guardar los cambios de los datos editados
  const handleSave = () => {
    setAlumnos(alumnos.map(alumno =>
      alumno.id === alumnoToEdit.id ? { 
        ...alumno, 
        nombre: Nombre, 
        apellido: Apellido, 
        correo: Correo, 
        telefono: Telefono, 
        direccion: Direccion, 
        fechaNacimiento: FechaNacimiento, 
        grado: Grado 
      } : alumno
    ));
    closeModal();
  };

  // Filtrar los alumnos según el término de búsqueda
  const filteredAlumnos = alumnos
    .filter(alumno => alumno.isHabilitado)
    .filter(alumno => 
      alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) || 
      alumno.grado.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Ordenar la lista de alumnos por el campo seleccionado y el orden
  const sortedAlumnos = filteredAlumnos.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1;
    return 0;
  });

  // Cambiar el campo y el orden al hacer clic en el encabezado de "Nombre" o "Apellido"
  const toggleSort = (field) => {
    if (field === sortField) {
      setSortAsc(!sortAsc);  // Cambiar solo el orden si ya estamos ordenando por el mismo campo
    } else {
      setSortField(field);
      setSortAsc(true); // Por defecto ordenar ascendente al cambiar el campo
    }
  };

  return (
    <div>
      <h2>Lista de Alumnos</h2>

      {/* Barra de búsqueda */}
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
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>{alumno.correo}</td>
              <td>{alumno.telefono}</td>
              <td>{alumno.direccion}</td>
              <td>{alumno.fechaNacimiento}</td>
              <td>{alumno.grado}</td>
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

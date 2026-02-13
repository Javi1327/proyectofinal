import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  // Nuevos estados para los padres
  const [correoPadre, setCorreoPadre] = useState('');
  const [telefonoPadre, setTelefonoPadre] = useState('');
  const [correoMadre, setCorreoMadre] = useState('');
  const [telefonoMadre, setTelefonoMadre] = useState('');
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
      setAlumnos(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error('Error al obtener los alumnos:', err);
      setAlumnos([]);
      toast.error('No se pudo cargar la lista de alumnos. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const obtenerCursos = async () => {
    try {
      const response = await fetch(`${backurl}cursos`);
      if (!response.ok) {
        throw new Error('Error al obtener cursos');
      }
      const result = await response.json();
      setCursos(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('Error al obtener cursos:', err);
      setCursos([]);
    }
  };

  // Función para eliminar alumno
  const eliminarAlumno = async (id) => {
    try {
      const response = await fetch(`${backurl}alumnos/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
      }) 
      if (response.ok) {
        setAlumnos(alumnos.filter(alumno => alumno._id !== id));
        toast.success('Alumno eliminado correctamente.');
      } else {
        console.error('Error al eliminar el alumno:', response.statusText);
        toast.error('Error al eliminar el alumno. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error al eliminar el alumno:', err);
      toast.error('Error al eliminar el alumno. Inténtalo de nuevo.');
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
    setGrado(alumno.grado?._id || '');
    // Nuevos campos de padres
    setCorreoPadre(alumno.correoPadre || '');
    setTelefonoPadre(alumno.telefonoPadre || '');
    setCorreoMadre(alumno.correoMadre || '');
    setTelefonoMadre(alumno.telefonoMadre || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAlumnoToEdit(null);
  };

  // Función para guardar cambios (ahora envía al backend)
  const fechaLocal = FechaNacimiento ? new Date(FechaNacimiento + 'T00:00:00') : null;

  const handleSave = async () => {
    if (!alumnoToEdit) return;

    const updatedAlumno = {
      nombre: Nombre,
      apellido: Apellido,
      correoElectronico: Correo,
      dni: Dni,
      telefono: Telefono,
      direccion: Direccion,
      fechaNacimiento: fechaLocal ? fechaLocal.toISOString() : null,
      grado: Grado,
      ...(correoPadre && { correoPadre }),
      ...(telefonoPadre && { telefonoPadre }),
      ...(correoMadre && { correoMadre }),
      ...(telefonoMadre && { telefonoMadre }),
    };

    try {
      const response = await fetch(`${backurl}alumnos/${alumnoToEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAlumno),
      });

      if (response.ok) {
        const result = await response.json();
        setAlumnos(alumnos.map(alumno =>
          alumno._id === alumnoToEdit._id ? { ...alumno, ...(result.data || result) } : alumno
        ));
        closeModal();
        toast.success('Alumno actualizado correctamente.');
      } else {
        console.error('Error en respuesta del servidor:', response.statusText);
        toast.error('Error al guardar los cambios. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error en fetch:', err);
      toast.error('Error al guardar los cambios. Inténtalo de nuevo.');
    }
  };

  // Filtrar alumnos habilitados y por búsqueda
  const filteredAlumnos = alumnos
    .filter(alumno => alumno.isHabilitado)
    .filter(alumno => {
      const gradoId = typeof alumno.grado === 'object' ? alumno.grado?._id : alumno.grado;
      const gradoNombre = cursos.find(c => c._id === gradoId)?.nombre;
      return alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (gradoNombre && gradoNombre.toLowerCase().includes(searchTerm.toLowerCase()));
    });

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
      <ToastContainer />
      <h2>Lista de Alumnos</h2>

      <input
        type="text"
        placeholder="Buscar por Apellido o Grado"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {cursos.length === 0 ? (
        <p>Cargando cursos...</p>
      ) : (
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
              {/* Nuevas columnas para padres */}
              <th>Correo Padre</th>
              <th>Teléfono Padre</th>
              <th>Correo Madre</th>
              <th>Teléfono Madre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlumnos.map(alumno => {
              const gradoId = typeof alumno.grado === 'object' ? alumno.grado?._id : alumno.grado;
              const gradoNombre = cursos.find(c => c._id === gradoId)?.nombre || 'Sin grado asignado';
              console.log(`Renderizando grado para ${alumno.nombre}: ${gradoNombre}`); // Log temporal para verificar render
              return (
                <tr key={alumno._id}>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellido}</td>
                  <td>{alumno.correoElectronico}</td>
                  <td>{alumno.dni}</td>
                  <td>{alumno.telefono}</td>
                  <td>{alumno.direccion}</td>
                  <td>{alumno.fechaNacimiento ? new Date(alumno.fechaNacimiento).toLocaleDateString('es-ES') : 'N/A'}</td>
                  <td>{gradoNombre}</td>
                  {/* Nuevos td para padres */}
                  <td>{alumno.correoPadre || 'N/A'}</td>
                  <td>{alumno.telefonoPadre || 'N/A'}</td>
                  <td>{alumno.correoMadre || 'N/A'}</td>
                  <td>{alumno.telefonoMadre || 'N/A'}</td>
                  <td>
                    <button onClick={() => openEditModal(alumno)}>Editar</button>
                    <button className='eliminar' onClick={() => eliminarAlumno(alumno._id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

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
              <select value={Grado} onChange={(e) => setGrado(e.target.value)}>
                <option value="">Seleccionar Grado</option>
                {cursos.map(curso => (
                  <option key={curso._id} value={curso._id}>{curso.nombre}</option>
                ))}
              </select>
            </label>
            {/* Nuevos labels para padres */}
            <label>
              Correo Padre:
              <input type="email" value={correoPadre} onChange={(e) => setCorreoPadre(e.target.value)} />
            </label>
            <label>
              Teléfono Padre:
              <input type="text" value={telefonoPadre} onChange={(e) => setTelefonoPadre(e.target.value)} />
            </label>
            <label>
              Correo Madre:
              <input type="email" value={correoMadre} onChange={(e) => setCorreoMadre(e.target.value)} />
            </label>
            <label>
              Teléfono Madre:
              <input type="text" value={telefonoMadre} onChange={(e) => setTelefonoMadre(e.target.value)} />
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
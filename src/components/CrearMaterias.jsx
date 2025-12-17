import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './CrearMaterias.css'

const CrearMateria = () => {
  const [nombreMateria, setNombreMateria] = useState('');
  const [selectedCursos, setSelectedCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingMateria, setEditingMateria] = useState(null);

  useEffect(() => {
    // Primero cargamos los cursos
    fetch('http://localhost:3000/cursos')
      .then((res) => res.json())
      .then((data) => {
        const opciones = data.map((curso) => ({
          value: curso._id,
          label: curso.nombre,
        }));
        setCursosDisponibles(opciones);
      })
      .catch((error) => {
        console.error('Error al cargar cursos:', error);
      });
  
    // También cargamos las materias
    fetch('http://localhost:3000/materias')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMaterias(data);
        } else {
          console.error('Formato inesperado al cargar materias:', data);
        }
      })
      .catch((error) => {
        console.error('Error al cargar materias:', error);
      });
  }, []);

  const handleSelectChange = (selectedOptions) => {
    setSelectedCursos(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreMateria || selectedCursos.length === 0) {
      setError('Por favor, ingrese el nombre de la materia y seleccione al menos un curso');
      setSuccessMessage('');
      return;
    }

    const cursosToSend = selectedCursos.map((option) => option.value);

    if (!editingMateria) {
      const materiaExistente = materias.find(
        (materia) => materia.nombreMateria.toLowerCase() === nombreMateria.toLowerCase()
      );
      if (materiaExistente) {
        setError('Ya existe una materia con ese nombre');
        setSuccessMessage('');
        return;
      }
    }

    const url = editingMateria
      ? `http://localhost:3000/materias/${editingMateria._id}`
      : 'http://localhost:3000/materias';
    const method = editingMateria ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreMateria,
          cursos: cursosToSend,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setSuccessMessage(editingMateria ? 'Materia modificada con éxito' : 'Materia creada con éxito');
        setError('');
        setEditingMateria(null);
        setNombreMateria('');
        setSelectedCursos([]);
        fetch('http://localhost:3000/materias')
          .then((response) => response.json())
          .then((data) => {
            setMaterias(Array.isArray(data) ? data : []);
          });
      } else {
        setError(data.message || 'Error al crear o modificar materia');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error al crear o modificar materia:', error);
      setError('Error al conectar con el servidor');
      setSuccessMessage('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      fetch(`http://localhost:3000/materias/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            setSuccessMessage('Materia eliminada con éxito');
            setMaterias((prevMaterias) => prevMaterias.filter((materia) => materia._id !== id));
          } else {
            setError(data.message || 'Error al eliminar la materia');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar materia:', error);
          setError('Error al conectar con el servidor');
        });
    }
  };

  const handleEditClick = (materia) => {
    setEditingMateria(materia);
    setNombreMateria(materia.nombreMateria);
    setSelectedCursos(
      materia.cursos.map((cursoId) => {
        const curso = cursosDisponibles.find((c) => c.value === cursoId);
        return curso ? { value: curso.value, label: curso.label } : null; // Solo devuelve si se encuentra el curso
      }).filter(Boolean) // Elimina los elementos nulos
    );
  };
  

  return (
    <div className="crear-materia-container">
      <h2>{editingMateria ? 'Modificar Materia' : 'Crear Materia'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de la Materia"
          value={nombreMateria}
          onChange={(e) => setNombreMateria(e.target.value)}
        />
        <div className="select-container">
          <h3>Seleccionar Cursos:</h3>
          <Select
            isMulti
            options={cursosDisponibles}
            value={selectedCursos}
            onChange={handleSelectChange}
            placeholder="Seleccionar cursos"
          />
        </div>
        <button type="submit">{editingMateria ? 'Modificar Materia' : 'Crear Materia'}</button>

        {editingMateria && (
          <button
            type="button"
            onClick={() => {
              setEditingMateria(null);
              setNombreMateria('');
              setSelectedCursos([]);
              setError('');
              setSuccessMessage('');
            }}
          >
            Cancelar Edición
          </button>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>

      <h3>Materias</h3>
      <ul>
        {Array.isArray(materias) &&
          materias.map((materia) => (
            <li key={materia._id}>
              {materia.nombreMateria} - Cursos: {materia.cursos.length}
              <button onClick={() => handleEditClick(materia)} style={{ marginLeft: '10px' }}>Editar</button>
              <button onClick={() => handleDelete(materia._id)} style={{ marginLeft: '5px' }}>Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CrearMateria;


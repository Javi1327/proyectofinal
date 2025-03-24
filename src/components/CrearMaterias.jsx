import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CrearMateria = () => {
  const [nombreMateria, setNombreMateria] = useState('');
  const [selectedCursos, setSelectedCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingMateria, setEditingMateria] = useState(null);

  const cursos = [
    { value: '1A', label: '1A' },
    { value: '1B', label: '1B' },
    { value: '2A', label: '2A' },
    { value: '2B', label: '2B' },
    { value: '3A', label: '3A' },
    { value: '3B', label: '3B' },
    { value: '4A', label: '4A' },
    { value: '4B', label: '4B' },
    { value: '5A', label: '5A' },
    { value: '5B', label: '5B' },
    { value: '6A', label: '6A' },
    { value: '6B', label: '6B' },
  ];

  useEffect(() => {
    fetch('http://localhost:3000/materias')
      .then((response) => response.json())
      .then((data) => {
        setMaterias(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error al obtener materias:', error);
        setError('Error al cargar las materias');
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
                console.log(data); // Esto te mostrará los datos obtenidos
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
    setSelectedCursos(materia.cursos.map((curso) => ({ value: curso, label: curso })));
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
            options={cursos}
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
              {materia.nombreMateria} - Cursos: {materia.cursos.join(', ')}
              <button onClick={() => handleEditClick(materia)} style={{ marginLeft: '10px' }}>Editar</button>
              <button onClick={() => handleDelete(materia._id)} style={{ marginLeft: '5px' }}>Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CrearMateria;



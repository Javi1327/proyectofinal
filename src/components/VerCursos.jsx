// VerCursos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const cursos = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

const VerCursos = () => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [todosAlumnos, setTodosAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  // Cargar todos los alumnos al iniciar
  useEffect(() => {
    const obtenerAlumnos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/alumnos');
        setTodosAlumnos(response.data.filter(alumno => alumno.isHabilitado));
      } catch (err) {
        console.error('Error al obtener alumnos:', err);
      }
    };
    obtenerAlumnos();
  }, []);

  // Filtrar alumnos por curso
  useEffect(() => {
    if (cursoSeleccionado) {
      const filtrados = todosAlumnos
        .filter(alumno => alumno.Grado === cursoSeleccionado)
        .sort((a, b) => a.Apellido.localeCompare(b.Apellido));
      setAlumnosFiltrados(filtrados);
    }
  }, [cursoSeleccionado, todosAlumnos]);

  // Función para agregar un alumno al curso
  const agregarAlumnoACurso = async () => {
    if (!alumnoSeleccionado) return;

    try {
      await axios.patch(`http://localhost:3001/alumnos/${alumnoSeleccionado.id}`, { Grado: cursoSeleccionado });
      setTodosAlumnos(prev => prev.map(alumno =>
        alumno.id === alumnoSeleccionado.id ? { ...alumno, Grado: cursoSeleccionado } : alumno
      ));
      setAlumnoSeleccionado(null);
    } catch (err) {
      console.error('Error al agregar alumno al curso:', err);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Cursos</h2>
      <div className="cursos-grid">
        {cursos.map(curso => (
          <button key={curso} onClick={() => setCursoSeleccionado(curso)} className="curso-btn">
            {curso}
          </button>
        ))}
      </div>

      {cursoSeleccionado && (
        <div className="curso-detalle">
          <h3>Alumnos de {cursoSeleccionado}</h3>
          {alumnosFiltrados.length === 0 ? (
            <p>No hay alumnos en este curso.</p>
          ) : (
            <ul>
              {alumnosFiltrados.map(alumno => (
                <li key={alumno.id}>{alumno.Apellido}, {alumno.Nombre}</li>
              ))}
            </ul>
          )}

          <h4>Agregar Alumno Existente</h4>
          <select value={alumnoSeleccionado?.id || ''} onChange={(e) => {
            const selected = todosAlumnos.find(alumno => alumno.id === e.target.value);
            setAlumnoSeleccionado(selected);
          }}>
            <option value="">Seleccionar alumno</option>
            {todosAlumnos
              .filter(alumno => alumno.Grado !== cursoSeleccionado)
              .map(alumno => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.Apellido}, {alumno.Nombre} ({alumno.Grado})
                </option>
              ))}
          </select>
          <button onClick={agregarAlumnoACurso}>Agregar al Curso</button>
        </div>
      )}
    </div>
  );
};

export default VerCursos;


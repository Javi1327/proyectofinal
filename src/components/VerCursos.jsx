// VerCursos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const cursos = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

const VerCursos = () => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [todosAlumnos, setTodosAlumnos] = useState([]);

  // Cargar todos los alumnos al iniciar
  useEffect(() => {
    const obtenerAlumnos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/alumnos');
        console.log('Respuesta de la API:', response.data);
        setTodosAlumnos(response.data.data.filter(alumno => alumno.isHabilitado));
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
        .filter(alumno => alumno.grado === cursoSeleccionado)
        .sort((a, b) => a.apellido.localeCompare(b.apellido));
      setAlumnosFiltrados(filtrados);
      console.log('Alumnos filtrados:', filtrados);
    }
  }, [cursoSeleccionado, todosAlumnos]);


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
                <li key={alumno.id}>{alumno.apellido}, {alumno.nombre}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default VerCursos;
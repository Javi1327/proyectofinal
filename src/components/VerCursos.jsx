import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./VerCursos.css"

const VerCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los cursos con sus alumnos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/cursos');
        console.log('Datos de cursos recibidos:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setCursos(response.data);
        } else {
          setError('Formato de datos incorrecto para cursos');
        }
      } catch (err) {
        setError('Error al cargar los cursos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  // Obtener alumnos del curso seleccionado directamente del estado
  const alumnosDelCurso = cursoSeleccionado 
    ? cursos.find(c => c.nombre === cursoSeleccionado)?.alumnos || []
    : [];

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1>Listado de Cursos</h1>
      
      <div className="cursos-container">
        <h2>Seleccione un curso:</h2>
        <div className="cursos-grid">
          {cursos.map((curso) => (
            <button
              key={curso.id || curso._id}
              onClick={() => setCursoSeleccionado(curso.nombre)}
              className={`curso-btn ${cursoSeleccionado === curso.nombre ? 'active' : ''}`}
            >
              {curso.nombre}
            </button>
          ))}
        </div>
      </div>

      {cursoSeleccionado && (
        <div className="alumnos-container">
          <h2>Alumnos de {cursoSeleccionado}</h2>
          
          {alumnosDelCurso.length > 0 ? (
            <div className="table-responsive">
              <table className="alumnos-table">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosDelCurso.map((alumno, index) => (
                    <tr key={alumno._id}>
                      <td>{index + 1}</td>
                      <td>{alumno.apellido}</td>
                      <td>{alumno.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-alumnos">No hay alumnos registrados en este curso</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerCursos;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./VerCursos.css"

const VerCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/cursos');
        if (response.data && Array.isArray(response.data)) {
          setCursos(response.data);
        } else {
          setError('Formato de datos incorrecto para cursos');
        }
      } catch (err) {
        setError('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  // FUNCIÓN CLAVE: Calcula el estado basado en el array de asistencia real
  const obtenerInfoFaltas = (asistencias = []) => {
  const totalFaltas = asistencias.filter(a => a.presente === false).length;
  // El orden de los IF es importante: primero el más grave
    if (totalFaltas >= 28) {
      return { 
        total: totalFaltas, 
        clase: "riesgo-libre", // Nueva clase CSS
        texto: "ALUMNO LIBRE" 
      };
    } 
    if (totalFaltas >= 20) {
      return { 
        total: totalFaltas, 
        clase: "riesgo-critico", 
        texto: "RIESGO EXTREMO" 
      };
    } 
    if (totalFaltas >= 12) {
      return { 
        total: totalFaltas, 
        clase: "riesgo-aviso", 
        texto: "EN ALERTA" 
      };
    }
    
    return { total: totalFaltas, clase: "riesgo-regular", texto: "REGULAR" };
  };

  const alumnosDelCurso = cursoSeleccionado 
    ? cursos.find(c => c.nombre === cursoSeleccionado)?.alumnos || []
    : [];

  if (loading) return <div className="loading">Cargando monitor de cursos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1>Monitor de Asistencia por Curso</h1>
      <div className="cursos-container">
        <h2>Seleccione un curso para evaluar riesgo:</h2>
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
    <div className="header-alumnos">
      <h2>Estado de Alumnos: {cursoSeleccionado}</h2>
      {/* Solo mostramos referencias si hay alumnos */}
      {alumnosDelCurso.length > 0 && (
        <div className="referencias">
           <span className="ref-item"><span className="punto verde"></span> Regular</span>
           <span className="ref-item"><span className="punto amarillo"></span> Aviso</span>
           <span className="ref-item"><span className="punto rojo"></span> Riesgo</span>
        </div>
      )}
    </div>
    
    {alumnosDelCurso.length > 0 ? (
      <div className="table-responsive">
        <table className="alumnos-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Apellido y Nombre</th>
              <th>Total Faltas</th>
              <th>Condición</th>
            </tr>
          </thead>
          <tbody>
            {alumnosDelCurso.map((alumno, index) => {
              const info = obtenerInfoFaltas(alumno.asistencia);
              return (
                <tr key={alumno._id}>
                  <td>{index + 1}</td>
                  <td className="nombre-celda">{alumno.apellido}, {alumno.nombre}</td>
                  <td className="faltas-numero">{info.total}</td>
                  <td>
                    <span className={`badge-riesgo ${info.clase}`}>
                      {info.texto}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      /* ESTE ES EL MENSAJE MEJORADO */
      <div className="no-alumnos-box">
        <div className="icon-warning">⚠️</div>
        <p>No hay alumnos registrados en <strong>{cursoSeleccionado}</strong>.</p>
        <small>Puedes agregar alumnos a este curso desde el panel de Administrador.</small>
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default VerCursos;
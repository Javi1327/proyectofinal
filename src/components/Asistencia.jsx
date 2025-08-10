import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Asistencia.css";

const Asistencia = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asistencia, setAsistencia] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [botonActivo, setBotonActivo] = useState({});

  useEffect(() => {
    const fetchCursos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/cursos');
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

  const alumnosDelCurso = cursoSeleccionado 
    ? cursos.find(c => c.nombre === cursoSeleccionado)?.alumnos || []
    : [];

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  const marcarAsistencia = (id, estado) => {
    setBotonActivo(prev => ({
    ...prev,
    [id]: estado ? 'presente' : 'ausente'
  }));

  const nuevaAsistencia = Array.isArray(asistencia[id]) ? [...asistencia[id]] : []; 
  const fechaActual = new Date().toISOString().split("T")[0];

  if (estado) {
    if (!nuevaAsistencia.includes(fechaActual)) {
      nuevaAsistencia.push(fechaActual);
    }
    } else {
    const index = nuevaAsistencia.indexOf(fechaActual);
    if (index > -1) {
      nuevaAsistencia.splice(index, 1);
    }
  }

    setAsistencia((prev) => ({ ...prev, [id]: nuevaAsistencia }));
  };

  const limpiarSeleccion = () => {
  setBotonActivo({});
  // setAsistencia({});
  };

  const guardarAsistencia = async () => {
    const registros = alumnosDelCurso.map(alumno => ({
      id: alumno._id,
      asistencia: asistencia[alumno._id] ? asistencia[alumno._id].map(fecha => ({ fecha: fecha, presente: true })) : [],
    })).filter(registro => registro.asistencia.length > 0);

    try {
      await Promise.all(registros.map(registro => {
        if (registro.id) {
          return axios.put(`http://localhost:3000/alumnos/${registro.id}`, { asistencia: registro.asistencia });
        } else {
          console.error("ID de alumno no definido:", registro);
          return Promise.reject(new Error("ID de alumno no definido"));
        }
      }));
      alert("Asistencia guardada!");
    } catch (error) {
      console.error("Error guardando asistencia:", error);
    }
    limpiarSeleccion();
  };

  return (
    <div>
      <h2>Lista de Cursos para Asistencias</h2>
      <div className="cursos-grid">
        {cursos.map(curso => (
          <button key={curso.nombre} onClick={() => setCursoSeleccionado(curso.nombre)} className="curso-btn">
            {curso.nombre}
          </button>
        ))}
      </div>

      {cursoSeleccionado && (
        <div className="curso-detalle">
          <h3>Alumnos de {cursoSeleccionado}</h3>
          {alumnosDelCurso.length === 0 ? (
            <p>No hay alumnos en este curso.</p>
          ) : (
            <ul>
              {alumnosDelCurso.map(alumno => (
                <li key={alumno._id}>
                  {alumno.apellido}, {alumno.nombre}
                  <button className={`presente ${botonActivo[alumno._id] === 'presente' ? 'active' : ''}`}
                  onClick={() => marcarAsistencia(alumno._id, true)}>Presente</button>

                  <button className={`ausente ${botonActivo[alumno._id] === 'ausente' ? 'active' : ''}`}
                  onClick={() => marcarAsistencia(alumno._id, false)}>Ausente</button>
                </li>
              ))}
            </ul>
          )}
          <button className="GuardarAsistecia" onClick={guardarAsistencia}>Guardar Asistencia</button>
        </div>
      )}
    </div>
  );
};

export default Asistencia;
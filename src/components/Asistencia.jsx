import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Asistencia.css";

const cursoss = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];

const Asistencia = () => {
  const [todosAlumnos, setTodosAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asistencia, setAsistencia] = useState({});

  useEffect(() => {
    const obtenerAlumnos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/alumnos');
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
      const estadoInicial = filtrados.reduce((acc, alumno) => {
        acc[alumno._id] = [];  
        return acc;
      }, {});
      setAsistencia(estadoInicial);
    }
  }, [cursoSeleccionado, todosAlumnos]);

  const marcarAsistencia = (id, estado) => {
    console.log("Estado de asistencia antes de marcar:", asistencia);
    console.log("ID de alumno:", id);

    const nuevaAsistencia = Array.isArray(asistencia[id]) ? [...asistencia[id]] : []; 
    const fechaActual = new Date().toISOString().split("T")[0]; // Formato de fecha YYYY-MM-DD
     
    if (estado) {
      // Si es presente, agrega la fecha
      if (!nuevaAsistencia.includes(fechaActual)) {
        nuevaAsistencia.push(fechaActual);
      }
    } else {
      // Si es ausente, elimina la fecha (si existe)
      const index = nuevaAsistencia.indexOf(fechaActual);
      if (index > -1) {
        nuevaAsistencia.splice(index, 1);
      }
    }

    setAsistencia((prev) => ({ ...prev, [id]: nuevaAsistencia }));
  };

  const guardarAsistencia = async () => {
    console.log("Estado de asistencia antes de guardar:", asistencia); 
    const registros = alumnosFiltrados.map(alumno => ({
      id: alumno._id,
      asistencia: asistencia[alumno._id] ? asistencia[alumno._id].map(fecha => ({ fecha: fecha, presente: true })) : [],
    }))
    .filter(registro => registro.asistencia.length > 0);
  
    console.log("Registros a guardar:", registros); // Verifica los registros
    
    try {
      await Promise.all(registros.map(registro => {
        if (registro.id) {  // Verifica que el ID no sea undefined
          console.log(`Guardando asistencia para el alumno ID: ${registro.id}`); // Verifica el ID
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
  };

  return (
    <div>
      <h2>Lista de Cursos para Asistencias</h2>
      <div className="cursos-grid">
        {cursoss.map(curso => (
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
                <li key={alumno._id}>
                  {alumno.apellido}, {alumno.nombre}
                  <button onClick={() => marcarAsistencia(alumno._id, true)}>
                    Presente
                  </button>
                  <button onClick={() => marcarAsistencia(alumno._id, false)}>
                    Ausente
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={guardarAsistencia}>Guardar Asistencia</button>
        </div>
      )}
    </div>
  );
};

export default Asistencia;
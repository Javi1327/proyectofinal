import React, { useState, useEffect } from "react";
import "./Asistencia.css";

const Asistencia = () => {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asistencia, setAsistencia] = useState({});
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetch("http://localhost:3001/cursos")
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error("Error cargando cursos:", error));
  }, []);

  const cargarAlumnos = (curso) => {
    setCursoSeleccionado(curso);
    fetch(`http://localhost:3001/alumnos?curso=${curso}`)
      .then((res) => res.json())
      .then((data) => {
        setAlumnos(data);
        const estadoInicial = data.reduce((acc, alumno) => {
          acc[alumno.id] = true; // Por defecto, todos presentes
          return acc;
        }, {});
        setAsistencia(estadoInicial);
      })
      .catch((error) => console.error("Error cargando alumnos:", error));
  };

  const marcarAsistencia = (id) => {
    setAsistencia((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const guardarAsistencia = () => {
    const registro = {
      fecha,
      curso: cursoSeleccionado,
      asistencia,
    };

    fetch("http://localhost:3001/asistencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registro),
    })
      .then(() => alert("Asistencia guardada!"))
      .catch((error) => console.error("Error guardando asistencia:", error));
  };

  return (
    <div>
      <h2>Registro de Asistencia</h2>
      <label>Seleccionar curso:</label>
      <select onChange={(e) => cargarAlumnos(e.target.value)}>
        <option value="">-- Seleccione --</option>
        {cursos.length > 0 ? (
          cursos.map((curso, index) => (
            <option key={index} value={curso.nombre || curso}>
              {curso.nombre || curso}
            </option>
          ))
        ) : (
          <option disabled>Cargando cursos...</option>
        )}
      </select>

      {cursoSeleccionado && (
        <div>
          <h3>Alumnos de {cursoSeleccionado}</h3>
          <ul>
            {alumnos.map((alumno) => (
              <li key={alumno.id}>
                {alumno.nombre} {alumno.apellido}
                <button onClick={() => marcarAsistencia(alumno.id)}>
                  {asistencia[alumno.id] ? "Presente" : "Ausente"}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={guardarAsistencia}>Guardar Asistencia</button>
        </div>
      )}
    </div>
  );
};

export default Asistencia;

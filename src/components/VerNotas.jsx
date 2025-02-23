import React, { useState, useEffect } from "react";
import "./VerNotas.css";

const VerNotas = () => {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  useEffect(() => {
    // Cargar los cursos que dicta el profesor
    fetch("http://localhost:3001/cursos")
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error("Error cargando cursos:", error));
  }, []);

  const cargarAlumnosYNotas = (curso) => {
    setCursoSeleccionado(curso);
    fetch(`http://localhost:3001/alumnos?Grado=${curso}`)
      .then((res) => res.json())
      .then((data) => setAlumnos(data))
      .catch((error) => console.error("Error cargando alumnos:", error));
  };

  return (
    <div>
      <h2>Ver Notas</h2>
      <label>Seleccionar curso:</label>
      <select onChange={(e) => cargarAlumnosYNotas(e.target.value)}>
        <option value="">-- Seleccione --</option>
        {cursos.map((curso) => (
          <option key={curso.id} value={curso.nombre}>
            {curso.nombre}
          </option>
        ))}
      </select>

      {cursoSeleccionado && (
        <div>
          <h3>Alumnos de {cursoSeleccionado}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.Nombre}</td>
                  <td>{alumno.Apellido}</td>
                  <td>{alumno.Correo}</td>
                  <td>{alumno.notas?.nota1 ?? "N/A"}</td>
                  <td>{alumno.notas?.nota2 ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerNotas;

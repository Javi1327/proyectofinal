import React, { useState, useEffect } from 'react';
import './SubirNotas.css';

export default function SubirNotas() {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [notas, setNotas] = useState({});
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [materia, setMateria] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar los cursos cuando el componente se monta
  useEffect(() => {
    fetch('http://localhost:3001/cursos')
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error('Error cargando cursos:', error));
  }, []);

  // Cargar las notas del curso seleccionado
  useEffect(() => {
    if (cursoSeleccionado) {
      fetch(`http://localhost:3001/notas?curso=${cursoSeleccionado}`)
        .then((res) => res.json())
        .then((data) => {
          const notasMapeadas = data.reduce((acc, nota) => {
            acc[nota.alumnoId] = nota; // Mapear las notas por alumnoId
            return acc;
          }, {});
          setNotas(notasMapeadas);
        })
        .catch((error) => console.error('Error cargando notas:', error));

      // También cargar los alumnos del curso
      fetch(`http://localhost:3001/alumnos?Grado=${cursoSeleccionado}`)
        .then((res) => res.json())
        .then((data) => setAlumnos(data))
        .catch((error) => console.error('Error cargando alumnos:', error));
    }
  }, [cursoSeleccionado]);

  // Función para manejar el envío del formulario de notas
  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje(`Nota registrada correctamente para ${nombreAlumno}`);
    setNombreAlumno('');
    setMateria('');
    setNota1('');
    setNota2('')
  };

  return (
    <div className="subir-notas-container">
      <h2>Subir Calificaciones</h2>
      <label>Seleccionar curso:</label>
      <select onChange={(e) => setCursoSeleccionado(e.target.value)}>
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
          <ul>
            {alumnos.map((alumno) => (
              <li key={alumno.id}>
                {alumno.Nombre} {alumno.Apellido}
                <span> - Nota 1: {notas[alumno.id]?.nota1 || 'N/A'}</span>
                <span> - Nota 2: {notas[alumno.id]?.nota2 || 'N/A'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Nombre del Alumno:</label>
        <input
          type="text"
          value={nombreAlumno}
          onChange={(e) => setNombreAlumno(e.target.value)}
          required
          maxLength="30"
        />

        <label>Materia:</label>
        <input
          type="text"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          required
          maxLength="30"
        />

        <label>Nota 1:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={nota1}
          onChange={(e) => setNota1(e.target.value)}
          required
        />

        <label>Nota 2:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={nota2}
          onChange={(e) => setNota2(e.target.value)}
          required
        />

        <button type="submit">Subir Nota</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

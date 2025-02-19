import React, { useState, useEffect } from 'react';
import './SubirNotas.css';

export default function SubirNotas() {
  const [cursos, setCursos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [notas, setNotas] = useState({});
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [materia, setMateria] = useState('');
  const [nota, setNota] = useState('');
  const [tipoNota, setTipoNota] = useState('nota1');
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

    // Buscar el alumno por nombre para obtener su ID (esto puede ajustarse a tu lógica)
    const alumno = alumnos.find((a) => `${a.Nombre} ${a.Apellido}` === nombreAlumno);
    if (!alumno) {
      setMensaje('Alumno no encontrado.');
      return;
    }

    const nuevaNota = {
      alumnoId: alumno.id,
      curso: cursoSeleccionado,
      [tipoNota]: nota, // Guardar la nota de acuerdo al tipo (nota1 o nota2)
    };

    // Enviar la nueva nota al servidor con un POST
    fetch('http://localhost:3001/notas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaNota),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotas((prevNotas) => ({
          ...prevNotas,
          [data.alumnoId]: data, // Actualizar las notas después de subirlas
        }));
        setMensaje(`Nota registrada correctamente para ${nombreAlumno}`);
        setNombreAlumno('');
        setMateria('');
        setNota('');
        setTipoNota('nota1');
      })
      .catch((error) => console.error('Error subiendo nota:', error));
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
        />

        <label>Materia:</label>
        <input
          type="text"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          required
        />

        <label>Nota:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          required
        />

        <label>Tipo de Nota:</label>
        <select
          value={tipoNota}
          onChange={(e) => setTipoNota(e.target.value)}
        >
          <option value="nota1">Nota 1</option>
          <option value="nota2">Nota 2</option>
        </select>

        <button type="submit">Subir Nota</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

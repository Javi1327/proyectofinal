import React, { useState, useEffect } from 'react';
import './SubirNotas.css';
import { useUser } from '../context/UserContext';

export default function SubirNotas() {
  const backurl = import.meta.env.VITE_URL_BACK;
  const { userId, userType } = useUser(); // ⬅️ Obtenemos el ID y tipo de usuario desde el contexto

  const [alumnos, setAlumnos] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [alumnoActual, setAlumnoActual] = useState(null);
  const [materia, setMateria] = useState(null);
  const [profesor, setProfesor] = useState(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos del profesor, materia y cursos asignados
  useEffect(() => {
    const fetchProfesor = async () => {
      if (userType === "profesor" && userId) {
        try {
          const res = await fetch(`${backurl}profesores/${userId}`);
          const data = await res.json();
          if (data?.data) {
            setProfesor(data.data);
            setMateria(data.data.materiaAsignada);
          }
        } catch (error) {
          console.error("Error al obtener el profesor:", error);
        }
      }
    };
    fetchProfesor();
  }, [backurl, userId, userType]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      if (gradoSeleccionado) {
        setLoading(true);
        try {
          const res = await fetch(`${backurl}cursos/${gradoSeleccionado}/alumnos`);
          const data = await res.json();
          if (Array.isArray(data.data)) {
            setAlumnos(data.data);
          } else {
            setAlumnos([]);
          }
        } catch (error) {
          console.error('Error cargando alumnos:', error);
          setAlumnos([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAlumnos([]);
      }
      setAlumnoSeleccionado('');
      setAlumnoActual(null);
      setNota1('');
      setNota2('');
      setMensaje('');
    };

    fetchAlumnos();
  }, [gradoSeleccionado, backurl]);

  useEffect(() => {
    const fetchAlumno = async () => {
      if (alumnoSeleccionado) {
        try {
          const res = await fetch(`${backurl}alumnos/${alumnoSeleccionado}`);
          const data = await res.json();
          if (data?.data) {
            setAlumnoActual(data.data);
            const matAlumno = data.data.materiasAlumno.find(
              m => m.materia._id === materia?._id
            );
            if (matAlumno) {
              setNota1(matAlumno.nota1?.toString() || '');
              setNota2(matAlumno.nota2?.toString() || '');
            } else {
              setNota1('');
              setNota2('');
            }
            setMensaje('');
          } else {
            setAlumnoActual(null);
          }
        } catch (error) {
          console.error("Error al cargar datos del alumno:", error);
          setAlumnoActual(null);
        }
      } else {
        setAlumnoActual(null);
        setNota1('');
        setNota2('');
      }
    };

    fetchAlumno();
  }, [alumnoSeleccionado, materia, backurl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setSubmitting(true);

    if (!alumnoSeleccionado || !alumnoActual) {
      setMensaje("Seleccioná un alumno válido.");
      setSubmitting(false);
      return;
    }

    if (!materia?._id) {
      setMensaje("Materia asignada no disponible.");
      setSubmitting(false);
      return;
    }

    const materiasActualizadas = [{
      materia: materia._id,
      nota1: parseFloat(nota1),
      nota2: parseFloat(nota2),
    }];

    const datosNota = {
      nombre: alumnoActual.nombre,
      apellido: alumnoActual.apellido,
      dni: alumnoActual.dni,
      grado: gradoSeleccionado,
      direccion: alumnoActual.direccion,
      telefono: alumnoActual.telefono,
      correoElectronico: alumnoActual.correoElectronico,
      fechaNacimiento: alumnoActual.fechaNacimiento,
      asistencia: alumnoActual.asistencia || [],
      materiasAlumno: materiasActualizadas,
    };
    console.log("Datos enviados al backend:", datosNota);

    try {
      const res = await fetch(`${backurl}alumnos/${alumnoSeleccionado}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosNota),
      });

      if (res.ok) {
        setMensaje("Nota registrada correctamente");
        setNota1('');
        setNota2('');
        setAlumnoSeleccionado('');
        setAlumnoActual(null);
      } else {
        const errorData = await res.json();
        setMensaje(errorData.message || "Error al registrar la nota");
      }
    } catch (error) {
      console.error("Error al subir la nota:", error);
      setMensaje("Error al registrar la nota");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="subir-notas-container">
      <h2>Subir Calificaciones</h2>
      {profesor && materia && (
        <p>
          Profesor: <strong>{profesor.nombre} {profesor.apellido}</strong> | Materia asignada: <strong>{materia.nombreMateria || "No disponible"}</strong>
        </p>
      )}

      <label>Seleccionar Curso:</label>
      <select onChange={(e) => setGradoSeleccionado(e.target.value)} value={gradoSeleccionado}>
        <option value="">-- Seleccione --</option>
        {profesor?.cursosAsignados?.map((curso) => (
          <option key={curso._id} value={curso._id}>{curso.nombre}</option>
        ))}
      </select>

      {gradoSeleccionado && (
        <div>
          <h3>Alumnos del curso seleccionado</h3>
          {loading ? (
            <p>Cargando alumnos...</p>
          ) : (
            <ul>
              {alumnos.map((alumno) => (
                <li
                  key={alumno._id}
                  style={{ backgroundColor: alumno._id === alumnoSeleccionado ? '#c5e4ff' : 'transparent' }}
                >
                  {alumno.nombre} {alumno.apellido}
                  <button onClick={() => setAlumnoSeleccionado(alumno._id)}>Seleccionar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={submitting || !alumnoSeleccionado}>Subir Nota</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

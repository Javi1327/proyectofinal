import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './SubirNotas.css';

export default function SubirNotas() {
  const backurl = import.meta.env.VITE_URL_BACK;
  
  const [alumnos, setAlumnos] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null); // Nuevo estado para la materia seleccionada
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar materias al inicio
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const res = await fetch(`${backurl}materias`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          const options = data.data.map(materia => ({
            value: materia._id,
            label: materia.nombreMateria
          }));
          setMaterias(options);
        } else {
          console.error('La respuesta no contiene un array de materias:', data);
        }
      } catch (error) {
        console.error('Error cargando materias:', error);
      }
    };

    fetchMaterias();
  }, [backurl]);

  // Cargar los cursos cuando el componente se monta
  useEffect(() => {
    const fetchAlumnos = async () => {
      if (gradoSeleccionado) {
        setLoading(true);
        try {
          const res = await fetch(`${backurl}alumnos?grado=${gradoSeleccionado}`);
          if (!res.ok) throw new Error('Error en la respuesta de la API');
          const data = await res.json();
          if (Array.isArray(data.data)) {
            setAlumnos(data.data);
          } else {
            console.error('La respuesta no es un array:', data);
            setAlumnos([]);
          }
        } catch (error) {
          console.error('Error cargando alumnos:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAlumnos();
  }, [gradoSeleccionado, backurl]);
  // Cargar las notas del curso seleccionado
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMensaje('');  
    // Crear el objeto de datos para enviar
    const datosNota = {
      materias: [
        {
          materia: materiaSeleccionada.value, // Asegúrate de que esto sea un ID válido de materia
          nota1: parseFloat(nota1),
          nota2: parseFloat(nota2),
          //nota1:nota1,
          //nota2:nota2,
        }        
      ]    
    };
    console.log('Datos a enviar:', JSON.stringify(datosNota));

     // Enviar la solicitud para actualizar las notas
     try {
      const res = await fetch(`${backurl}alumnos/${alumnoSeleccionado}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosNota),
      });

      if (res.ok) {
        setMensaje(`Nota registrada correctamente para el alumno con ID: ${alumnoSeleccionado}`);
        setAlumnoSeleccionado('');
        setMateriaSeleccionada(null);
        setNota1('');
        setNota2('');
      } else {
        throw new Error('Error al registrar la nota');
      }
    } catch (error) {
      console.error('Error al subir la nota:', error);
      setMensaje('Error al registrar la nota');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="subir-notas-container">
      <h2>Subir Calificaciones</h2>
      <label>Seleccionar Grado:</label>
      <select onChange={(e) => setGradoSeleccionado(e.target.value)}>
        <option value="">-- Seleccione --</option>
        <option value="1°">1°</option>
        <option value="2A°">2A°</option>
        <option value="3w°">3°</option>  
      </select>

      {gradoSeleccionado && (
        <div>
          <h3>Alumnos de {gradoSeleccionado}</h3>
          {loading ? (
            <p>Cargando alumnos...</p>
          ) : (
            <ul>
              {alumnos.map((alumno) => (
                <li key={alumno.id}
                style={{ backgroundColor: alumno.id === alumnoSeleccionado ? '#c5e4ff' : 'transparent' }} >
                  {alumno.nombre} {alumno.apellido}
                  <button onClick={() => setAlumnoSeleccionado(alumno.id)}>Seleccionar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
         
        <label>Materia:</label>
        <Select
        options={materias}
        onChange={(selectedOption) => setMateriaSeleccionada(selectedOption)}
        isClearable
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

        <button type="submit" disabled={submitting}>Subir Nota</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import "./VerNotas.css";

const VerNotas = () => {
  const backurl = import.meta.env.VITE_URL_BACK; // Asegúrate de que esta variable esté definida
  const [alumnos, setAlumnos] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(""); // Renombrado a grado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [materias, setMaterias] = useState([]);

  // Cargar alumnos cuando se selecciona un grado
  useEffect(() => {
    if (gradoSeleccionado) {
      const fetchAlumnos = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(`${backurl}alumnos?grado=${gradoSeleccionado}`);
          if (!res.ok) throw new Error("Error al cargar alumnos");
          const data = await res.json();
          setAlumnos(data.data || []); // Asegúrate de que la estructura de respuesta sea correcta
        } catch (error) {
          console.error("Error al obtener alumnos:", error);
          setError("No se pudieron cargar los alumnos.");
        } finally {
          setLoading(false);
        }
      };

      fetchAlumnos();
    } else {
      setAlumnos([]); // Limpiar la lista de alumnos si no se selecciona un grado
    }
  }, [gradoSeleccionado, backurl]);

  // useEffect para obtener materias
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${backurl}materias`);
        if (!response.ok) {
          throw new Error('Error al obtener materias');
        }
        const result = await response.json();
        console.log("Respuesta de materias:", result); // Verifica la respuesta de la API
        if (Array.isArray(result.data)) { // Asegúrate de que result.data sea un array
          setMaterias(result.data); // Establece las materias
        } else {
          throw new Error('La respuesta no es un array');
        }
      } catch (error) {
        console.error('Error al obtener materias:', error);
        setError("No se pudieron cargar las materias.");
      }
    };
  
    fetchMaterias();
  }, []); // Este useEffect se ejecuta una vez al montar el componente

  
  return (
    <div className="ver-notas-container">
      <h2>Ver Notas</h2>
      <div className="grado-selector">
        <label htmlFor="grado-select">Seleccionar grado:</label>
        <select
          id="grado-select"
          value={gradoSeleccionado}
          onChange={(e) => setGradoSeleccionado(e.target.value)}
        >
          <option value="">-- Seleccione --</option>
          <option value="Grado 1">Grado 1</option>
          <option value="Grado 2">Grado 2</option>
          <option value="Grado 3">Grado 3</option>
        </select>
      </div>

      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {gradoSeleccionado && !loading && (
        <div className="alumnos-list">
          <h3>Alumnos de {gradoSeleccionado}</h3>
          {alumnos.length > 0 ? (
            <table className="notas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Materia</th>
                  <th>Nota 1</th>
                  <th>Nota 2</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno) => (
                  alumno.materias.map((materia) => {
                    // Buscar el nombre de la materia usando el ID
                    const materiaEncontrada = materias.find(m => m._id === materia.materia);
                    const nombreMateria = materiaEncontrada ? materiaEncontrada.nombreMateria : "N/A";

                    return (
                      <tr key={alumno.id + materia._id}>
                        <td>{alumno.nombre}</td>
                        <td>{alumno.apellido}</td>
                        <td>{alumno.correoElectronico}</td>
                        <td>{nombreMateria}</td> {/* Mostrar el nombre de la materia */}
                        <td>{materia.nota1 != null ? materia.nota1.toFixed(2) : "N/A"}</td>
                        <td>{materia.nota2 != null ? materia.nota2.toFixed(2) : "N/A"}</td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay alumnos en este grado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerNotas;
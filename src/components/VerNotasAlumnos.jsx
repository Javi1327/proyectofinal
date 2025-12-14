import React, { useState, useEffect } from "react";
import { useUser } from '../context/UserContext';
import './VerNotasAlumnos.css'

const VerNotasAlumnos = () => {
  const { alumnoId } = useUser(); // Obtén el ID del alumno del contexto
  const backurl = import.meta.env.VITE_URL_BACK; 

  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [materias, setMaterias] = useState([]);
  const [notasCargadas, setNotasCargadas] = useState(false);
  console.log("ID del alumno:", alumnoId); 

  // Verifica si el alumnoId está disponible
  if (!alumnoId) {
    return <p>Error: No se ha encontrado el ID del alumno. Por favor, inicie sesión nuevamente.</p>;
  }

  // useEffect para obtener materias (igual)
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${backurl}materias`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Respuesta completa de materias:", result);
        console.log("¿Es array? Array.isArray(result):", Array.isArray(result));
        console.log("Contenido de result:", JSON.stringify(result, null, 2));

        if (Array.isArray(result)) {
          setMaterias(result);
          console.log("Materias cargadas correctamente:", result);
        } else {
          throw new Error('La respuesta no es un array.');
        }
      } catch (error) {
        console.error('Error al obtener materias:', error);
        setError(`No se pudieron cargar las materias: ${error.message}`);
      }
    };
  
    fetchMaterias();
  }, [backurl]);

  useEffect(() => {
    console.log("Intentando fetch de notas...");
    const fetchNotas = async () => {
      if (notasCargadas) {
        console.log("Notas ya cargadas, saltando.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${backurl}alumnos/${alumnoId}`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("ESTRUCTURA COMPLETA DE DATA:", JSON.stringify(data, null, 2));
        console.log("Materias en data.materiasAlumno:", data.data ? data.data.materiasAlumno : "No existe data.data");

        // Acceso correcto: data.materiasAlumno
        const notasData = data.data?.materiasAlumno || [];
        if (notasData.length === 0) {
          console.warn("No hay notas para este alumno en el backend.");
          setError("No hay notas disponibles para este alumno. Contacta al administrador.");
        }
        setNotas(notasData);
        setNotasCargadas(true);
        console.log("Notas cargadas:", notasData);
      } catch (error) {
        console.error("Error al obtener notas:", error);
        setError(`No se pudieron cargar las notas: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (alumnoId && !notasCargadas) {
      fetchNotas();
    }
  }, [alumnoId, backurl, notasCargadas]);

  return (
    <div className="ver-notas-container">
      <h2>Mis Notas</h2>
      {loading && <p>Cargando notas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="notas-table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {notas.length > 0 ? (
            notas.map((materia, index) => {
              const materiaEncontrada = materias.find(m => m._id === materia.materia._id); // Accede a materia._id
              const nombreMateria = materiaEncontrada ? materiaEncontrada.nombreMateria : "N/A";

              return (
                <tr key={index}>
                  <td>{nombreMateria}</td>
                  <td>{materia.nota1 != null ? materia.nota1.toFixed(2) : "N/A"}</td>
                  <td>{materia.nota2 != null ? materia.nota2.toFixed(2) : "N/A"}</td>
                  <td>{materia.promedio != null ? materia.promedio.toFixed(2) : "N/A"}</td> {/* Usa promedio del backend */}
                </tr>
              );
            })
          ) : (
            !loading && <tr><td colSpan="4">No hay notas disponibles.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerNotasAlumnos;
import React, { useState, useEffect } from "react";
import { useUser  } from '../context/UserContext';
import "./VerNotas.css"; // Asegúrate de que el CSS esté disponible

const VerNotasAlumnos = () => {
  const { alumnoId } = useUser (); // Obtén el ID del alumno del contexto
  const backurl = import.meta.env.VITE_URL_BACK; 

  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [materias, setMaterias] = useState([]);
 // const alumnoId = "e38edc15-c22e-4ea9-b9a0-ed09f9706aae"; // ID del alumno hardcodeado cambiarlo para harlo desde el login
 console.log("ID del alumno:", alumnoId); 

  // Verifica si el alumnoId está disponible
  if (!alumnoId) {
    return <p>Error: No se ha encontrado el ID del alumno. Por favor, inicie sesión nuevamente.</p>;
  }
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
  }, [backurl]); // Este useEffect se ejecuta una vez al montar el componente

  useEffect(() => {
    const fetchNotas = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${backurl}alumnos/${alumnoId}`);
        if (!response.ok) {
          throw new Error("Error al obtener las notas");
        }
        const data = await response.json();
        console.log("Datos recibidos:", data); // Para depuración
        setNotas(data.data.materias || []); // Accede a la propiedad 'materias' dentro de 'data'
      } catch (error) {
        console.error("Error al obtener notas:", error);
        setError("No se pudieron cargar las notas.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, [alumnoId, backurl]);

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
              // Buscar el nombre de la materia usando el ID
              const materiaEncontrada = materias.find(m => m._id === materia.materia);
              const nombreMateria = materiaEncontrada ? materiaEncontrada.nombreMateria : "N/A";

              return (
                <tr key={index}>
                  <td>{nombreMateria}</td> {/* Mostrar el nombre de la materia */}
                  <td>{materia.nota1 != null ? materia.nota1.toFixed(2) : "N/A"}</td>
                  <td>{materia.nota2 != null ? materia.nota2.toFixed(2) : "N/A"}</td>
                  <td>{((materia.nota1 + materia.nota2) / 2).toFixed(2)}</td> {/* Cálculo del promedio */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">No hay notas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerNotasAlumnos;
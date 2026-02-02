import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import './VerNotasAlumnos.css';

const VerNotasAlumnos = () => {
  const { user, role } = useUser();
  const navigate = useNavigate();
  const backurl = import.meta.env.VITE_URL_BACK;

  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [materias, setMaterias] = useState([]);
  const [notasCargadas, setNotasCargadas] = useState(false);
  const [estadoGeneral, setEstadoGeneral] = useState("");  // Nuevo: Estado general del alumno

  // Protección: Solo alumnos pueden acceder
  useEffect(() => {
    if (role !== 'alumno') {
      navigate('/');
      return;
    }
  }, [role, navigate]);

  // Verifica si user.id está disponible
  if (!user?.id) {
    return <p>Error: No se ha encontrado el ID del alumno. Por favor, inicie sesión nuevamente.</p>;
  }

  // useEffect para obtener materias
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${backurl}materias`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Respuesta completa de materias:", result);
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
        const response = await fetch(`${backurl}alumnos/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("ESTRUCTURA COMPLETA DE DATA:", JSON.stringify(data, null, 2));
        console.log("Materias en data.materiasAlumno:", data.data ? data.data.materiasAlumno : "No existe data.data");

        // Acceso correcto: data.data.materiasAlumno y data.data.estadoGeneral
        const notasData = data.data?.materiasAlumno || [];
        const estadoGen = data.data?.estadoGeneral || "pendiente";  // Nuevo: Estado general
        setEstadoGeneral(estadoGen);  // Nuevo: Setea estado general

        if (notasData.length === 0) {
          console.warn("No hay notas para este alumno en el backend.");
          setError("No hay notas disponibles para este alumno. Contacta al administrador.");
        }
        setNotas(notasData);
        setNotasCargadas(true);
        console.log("Notas cargadas:", notasData);
        console.log("Estado general:", estadoGen);  // Nuevo: Log estado general
      } catch (error) {
        console.error("Error al obtener notas:", error);
        setError(`No se pudieron cargar las notas: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user.id && !notasCargadas && role === 'alumno') {
      fetchNotas();
    }
  }, [user.id, backurl, notasCargadas, role]);

  return (
    <div className="ver-notas-container">
      <h2>Mis Notas</h2>
      
      {/* Nuevo: Mostrar Estado General */}
      <p><strong>Estado General:</strong> {estadoGeneral.charAt(0).toUpperCase() + estadoGeneral.slice(1)}</p>
      
      <button onClick={() => navigate('/alumno/home')} className="volver-btn">Volver al Panel</button> 
      {loading && <p>Cargando notas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="notas-table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Nota 1</th>
            <th>Nota 2</th>           
            <th>Recuperatorio 1</th>  {/* Nuevo */}
            <th>Recuperatorio 2</th>  {/* Nuevo */}
            <th>Promedio</th>
            <th>Estado</th>  {/* Nuevo */}
          </tr>
        </thead>
        <tbody>
          {notas.length > 0 ? (
            notas.map((materia, index) => {
              const materiaEncontrada = materias.find(m => m._id === materia.materia._id);
              const nombreMateria = materiaEncontrada ? materiaEncontrada.nombreMateria : "N/A";

              return (
                <tr key={index}>
                  <td>{nombreMateria}</td>
                  <td>{materia.nota1 != null ? materia.nota1.toFixed(2) : "N/A"}</td>
                  <td>{materia.nota2 != null ? materia.nota2.toFixed(2) : "N/A"}</td>
                  <td>{materia.notaRecuperatorio1 != null ? materia.notaRecuperatorio1.toFixed(2) : "N/A"}</td>  {/* Nuevo */}
                  <td>{materia.notaRecuperatorio2 != null ? materia.notaRecuperatorio2.toFixed(2) : "N/A"}</td>  {/* Nuevo */}
                  <td>{materia.promedio != null ? materia.promedio.toFixed(2) : "N/A"}</td>
                  <td>{materia.estado ? materia.estado.charAt(0).toUpperCase() + materia.estado.slice(1) : "Pendiente"}</td>  {/* Nuevo */}
                </tr>
              );
            })
          ) : (
            !loading && <tr><td colSpan="7">No hay notas disponibles.</td></tr>  // Actualiza colSpan a 7
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerNotasAlumnos;
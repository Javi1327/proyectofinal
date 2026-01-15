import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Agrega para navegación
import { useUser } from '../context/UserContext';
import './VerNotasAlumnos.css';

const VerNotasAlumnos = () => {
  const { user, role } = useUser();  // Cambia alumnoId a user.id
  const navigate = useNavigate();  // Agrega para protección
  const backurl = import.meta.env.VITE_URL_BACK;

  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [materias, setMaterias] = useState([]);
  const [notasCargadas, setNotasCargadas] = useState(false);

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

  // useEffect para obtener materias (igual, pero agrega auth si backend lo requiere)
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${backurl}materias`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,  // Agrega token si backend lo protege
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
        const response = await fetch(`${backurl}alumnos/${user.id}`, {  // Cambia alumnoId a user.id
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,  // Agrega token JWT
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("ESTRUCTURA COMPLETA DE DATA:", JSON.stringify(data, null, 2));
        console.log("Materias en data.materiasAlumno:", data.data ? data.data.materiasAlumno : "No existe data.data");

        // Acceso correcto: data.data.materiasAlumno
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

    if (user.id && !notasCargadas && role === 'alumno') {  // Agrega check de role
      fetchNotas();
    }
  }, [user.id, backurl, notasCargadas, role]);  // Cambia alumnoId a user.id


  return (
    <div className="ver-notas-container">
      <h2>Mis Notas</h2>
      <button onClick={() => navigate('/alumno/home')} className="volver-btn">Volver al Panel</button> 
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
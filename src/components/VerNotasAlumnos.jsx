import React, { useState, useEffect } from "react";

const VerNotasAlumnos = () => {
  const [notas, setNotas] = useState([]);
  const alumnoId = "123"; // Reemplázalo con el ID real del alumno logueado

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const response = await fetch(`http://localhost:3001/alumnos/${alumnoId}`);
        if (!response.ok) {
          throw new Error("Error al obtener las notas");
        }
        const data = await response.json();
        setNotas(data.materias || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotas();
  }, [alumnoId]);

  return (
    <div className="notas-container">
      <h2>Mis Notas</h2>
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
          {notas.map((materia, index) => (
            <tr key={index}>
              <td>{materia.materia}</td>
              <td>{materia.nota1}</td>
              <td>{materia.nota2}</td>
              <td>{materia.promedio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerNotasAlumnos;

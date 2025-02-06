import React, { useState, useEffect } from 'react';
import './VerCursos.css'; // Asegúrate de tener el archivo de estilos

const VerCursos = () => {
  const [cursos, setCursos] = useState([]);

  // Usar datos de prueba para los cursos
  useEffect(() => {
    // Aquí se haría la llamada a la API o la base de datos
    const datosCursos = [
      { id: 1, nombre: '3A' },
      { id: 2, nombre: '2A' },
      { id: 3, nombre: '2B' },
    ];
    setCursos(datosCursos); // Cargar los datos en el estado
  }, []);

  return (
    <div className="ver-cursos">
      <h2>Cursos Disponibles</h2>
      <ul className="cursos-lista">
        {cursos.map((curso) => (
          <li key={curso.id} className="curso-item">
            {curso.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerCursos;

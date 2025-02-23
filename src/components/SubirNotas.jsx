import React, { useState } from 'react';
import './SubirNotas.css';

export default function SubirNotas() {
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [materia, setMateria] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje(`Nota registrada correctamente para ${nombreAlumno}`);
    setNombreAlumno('');
    setMateria('');
    setNota1('');
    setNota2('')
  };

  return (
    <div className="subir-notas-container">
      <h2>Subir Calificaciones</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre del Alumno:</label>
        <input
          type="text"
          value={nombreAlumno}
          onChange={(e) => setNombreAlumno(e.target.value)}
          required
          maxLength="30"
        />

        <label>Materia:</label>
        <input
          type="text"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          required
          maxLength="30"
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

        <button type="submit">Subir Nota</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
} 

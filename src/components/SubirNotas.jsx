import React, { useState } from 'react';
import './SubirNotas.css';

export default function SubirNotas() {
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [materia, setMateria] = useState('');
  const [nota, setNota] = useState('');
  const [tipoNota, setTipoNota] = useState('nota1');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje(`Nota registrada correctamente para ${nombreAlumno}`);
    setNombreAlumno('');
    setMateria('');
    setNota('');
    setTipoNota('nota1');
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
        />

        <label>Materia:</label>
        <input
          type="text"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          required
        />

        <label>Nota:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          required
        />

        <label>Tipo de Nota:</label>
        <select
          value={tipoNota}
          onChange={(e) => setTipoNota(e.target.value)}
        >
          <option value="nota1">Nota 1</option>
          <option value="nota2">Nota 2</option>
        </select>

        <button type="submit">Subir Nota</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
} 

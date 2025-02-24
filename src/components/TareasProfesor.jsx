import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const TareasProfesor = () => {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const obtenerTareas = async () => {
      const respuesta = await fetch("http://localhost:3001/tareas");
      const datos = await respuesta.json();
      setTareas(datos);
    };

    obtenerTareas();
  }, []);

  const agregarTarea = async () => {
    if (!titulo || !descripcion || !fechaEntrega) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevaTarea = {
      id: uuidv4(),
      titulo,
      descripcion,
      fechaEntrega,
      estado: "Pendiente",
      archivoProfesor: archivo ? archivo.name : null,
      tareasEnviadas: []
    };

    const respuesta = await fetch("http://localhost:3001/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaTarea)
    });

    if (respuesta.ok) {
      setTareas([...tareas, nuevaTarea]);
      setTitulo("");
      setDescripcion("");
      setFechaEntrega("");
      setArchivo(null);
    }
  };

  const eliminarTarea = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      await fetch(`http://localhost:3001/tareas/${id}`, {
        method: "DELETE"
      });
      setTareas(tareas.filter((tarea) => tarea.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Tareas</h2>
      <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="border p-1 w-full mb-2" />
      <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border p-1 w-full mb-2"></textarea>
      <input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} className="border p-1 w-full mb-2" />
      <input type="file" onChange={(e) => setArchivo(e.target.files[0])} className="mb-2" />
      <button onClick={agregarTarea} className="bg-blue-500 text-white px-3 py-1 rounded">Agregar Tarea</button>

      <h3 className="text-lg font-semibold mt-4">Tareas Asignadas</h3>
      {tareas.map((tarea) => (
        <div key={tarea.id} className="border p-3 mb-3 rounded-lg">
          <h3 className="font-semibold">{tarea.titulo}</h3>
          <p>{tarea.descripcion}</p>
          <p className="text-sm text-gray-500">Entrega: {tarea.fechaEntrega}</p>
          <button onClick={() => eliminarTarea(tarea.id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default TareasProfesor;






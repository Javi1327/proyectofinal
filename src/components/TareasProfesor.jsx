import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const TareasProfesor = () => {
  const backurl = import.meta.env.VITE_URL_BACK;  // Asegúrate de que la URL esté correcta

  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const obtenerTareas = async () => {
      try {
        const respuesta = await fetch(`${backurl}/tareas`);
        if (!respuesta.ok) throw new Error('Error al obtener tareas');
        const datos = await respuesta.json();
        setTareas(datos);
      } catch (error) {
        setMensajeError('No se pudieron cargar las tareas.');
        console.error('Error al obtener tareas:', error);
      }
    };

    obtenerTareas();
  }, [backurl]);

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

    try {
      const respuesta = await fetch(`${backurl}/tareas`, {
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
      } else {
        throw new Error('Error al agregar la tarea');
      }
    } catch (error) {
      setMensajeError('No se pudo agregar la tarea.');
      console.error('Error al agregar tarea:', error);
    }
  };

  const eliminarTarea = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      try {
        const respuesta = await fetch(`${backurl}/tareas/${id}`, {
          method: "DELETE"
        });

        if (respuesta.ok) {
          setTareas(tareas.filter((tarea) => tarea.id !== id));
        } else {
          throw new Error('Error al eliminar la tarea');
        }
      } catch (error) {
        setMensajeError('No se pudo eliminar la tarea.');
        console.error('Error al eliminar tarea:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Tareas</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="border p-1 w-full mb-2"
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="border p-1 w-full mb-2"
      ></textarea>
      <input
        type="date"
        value={fechaEntrega}
        onChange={(e) => setFechaEntrega(e.target.value)}
        className="border p-1 w-full mb-2"
      />
      <input
        type="file"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={agregarTarea}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Agregar Tarea
      </button>

      {mensajeError && <p className="text-red-500">{mensajeError}</p>}

      <h3 className="text-lg font-semibold mt-4">Tareas Asignadas</h3>
      {tareas.length === 0 ? (
        <p>No hay tareas asignadas.</p>
      ) : (
        tareas.map((tarea) => (
          <div key={tarea.id} className="border p-3 mb-3 rounded-lg">
            <h3 className="font-semibold">{tarea.titulo}</h3>
            <p>{tarea.descripcion}</p>
            <p className="text-sm text-gray-500">Entrega: {tarea.fechaEntrega}</p>
            <button
              onClick={() => eliminarTarea(tarea.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TareasProfesor;







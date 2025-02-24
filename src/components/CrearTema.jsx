import React, { useState } from "react";

const CrearTema = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const crearTema = async () => {
    if (!titulo || !descripcion) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    const nuevoTema = {
      titulo,
      descripcion,
      autor: "Juan Pérez",  // Esto podría ser dinámico según el usuario
      comentarios: [],
    };

    const respuesta = await fetch("http://localhost:3001/temasForo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoTema),
    });

    if (respuesta.ok) {
      setMensaje("Tema creado exitosamente");
    } else {
      setMensaje("Error al crear el tema");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Tema</h2>
      {mensaje && <p className="text-green-500">{mensaje}</p>}
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
      <button onClick={crearTema} className="bg-blue-500 text-white px-3 py-1 rounded">
        Crear Tema
      </button>
    </div>
  );
};

export default CrearTema;

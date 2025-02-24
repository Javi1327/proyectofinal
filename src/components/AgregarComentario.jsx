import React, { useState } from "react";

const AgregarComentario = ({ temaId }) => {
  const [comentario, setComentario] = useState("");

  const agregarComentario = async () => {
    const nuevoComentario = {
      autor: "Juan Pérez",  // Esto debe ser el autor actual del usuario
      comentario,
    };

    const respuesta = await fetch(`http://localhost:3001/temasForo/${temaId}/comentarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoComentario),
    });

    if (respuesta.ok) {
      setComentario("");
    } else {
      alert("Error al agregar el comentario");
    }
  };

  return (
    <div className="p-4">
      <textarea
        placeholder="Escribe tu comentario"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="border p-1 w-full mb-2"
      ></textarea>
      <button onClick={agregarComentario} className="bg-green-500 text-white px-3 py-1 rounded">
        Comentar
      </button>
    </div>
  );
};

export default AgregarComentario;

import React, { useState, useEffect } from "react";
import "./Foro.css";


const Foro = () => {
  const [temas, setTemas] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [comentario, setComentario] = useState("");
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);

  // Obtener los temas desde la API simulada
  useEffect(() => {
    const obtenerTemas = async () => {
      const respuesta = await fetch("http://localhost:3001/temasForo");
      const datos = await respuesta.json();
      setTemas(datos);
    };
    obtenerTemas();
  }, []);

  // Crear un nuevo tema
  const crearTema = async () => {
    const nuevoTema = {
      id: Date.now().toString(),
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion,
      autor: "Alumno", // El nombre del autor puede ser dinámico según el usuario
      comentarios: [],
    };

    await fetch("http://localhost:3001/temasForo", {
      method: "POST",
      body: JSON.stringify(nuevoTema),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Actualizar los temas en el estado
    setTemas([...temas, nuevoTema]);
    setNuevoTitulo("");
    setNuevaDescripcion("");
  };

  // Agregar un comentario a un tema
  const agregarComentario = async () => {
    if (!comentario) return;

    const comentarioNuevo = {
      autor: "Alumno", // El nombre del autor puede ser dinámico según el usuario
      comentario,
    };

    const temaActualizado = {
      ...temaSeleccionado,
      comentarios: [...temaSeleccionado.comentarios, comentarioNuevo],
    };

    await fetch(`http://localhost:3001/temasForo/${temaSeleccionado.id}`, {
      method: "PATCH",
      body: JSON.stringify(temaActualizado),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Actualizar los temas en el estado
    setTemas(
      temas.map((tema) =>
        tema.id === temaSeleccionado.id ? temaActualizado : tema
      )
    );

    setComentario(""); // Limpiar el campo de comentario
    setTemaSeleccionado(null); // Volver a la lista de temas
  };

  return (
    <div>
      <h2>Foro del Curso</h2>

      {/* Formulario para crear un nuevo tema */}
      <div>
        <h3>Crear un nuevo tema</h3>
        <input
          type="text"
          placeholder="Título"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={nuevaDescripcion}
          onChange={(e) => setNuevaDescripcion(e.target.value)}
        />
        <button onClick={crearTema}>Crear Tema</button>
      </div>

      <h3>Temas</h3>
      <ul>
        {temas.map((tema) => (
          <li key={tema.id} onClick={() => setTemaSeleccionado(tema)}>
            <strong>{tema.titulo}</strong> - {tema.descripcion}
            <p>Autor: {tema.autor}</p>
            <p>Comentarios: {tema.comentarios.length}</p>
          </li>
        ))}
      </ul>

      {temaSeleccionado && (
        <div>
          <h3>{temaSeleccionado.titulo}</h3>
          <p>{temaSeleccionado.descripcion}</p>
          <h4>Comentarios</h4>
          <ul>
            {temaSeleccionado.comentarios.map((com, index) => (
              <li key={index}>
                <strong>{com.autor}</strong>: {com.comentario}
              </li>
            ))}
          </ul>

          {/* Formulario para agregar comentario */}
          <textarea
            placeholder="Escribe un comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <button onClick={agregarComentario}>Agregar Comentario</button>
        </div>
      )}
    </div>
  );
};

export default Foro;

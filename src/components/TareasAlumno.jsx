import React, { useState, useEffect } from "react";

const TareasAlumno = () => {
  const [tareas, setTareas] = useState([]);
  const [archivos, setArchivos] = useState({});
  const [tareasEnviadas, setTareasEnviadas] = useState([]);

  useEffect(() => {
    const obtenerTareas = async () => {
      const respuesta = await fetch("http://localhost:3001/tareas");
      const datos = await respuesta.json();
      setTareas(datos);
    };

    obtenerTareas();
  }, []);

  const manejarArchivo = (e, idTarea) => {
    setArchivos({ ...archivos, [idTarea]: e.target.files[0] });
  };

  const subirTarea = async (idTarea) => {
    if (!archivos[idTarea]) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    try {
      // Obtener la tarea actual
      const respuesta = await fetch(`http://localhost:3001/tareas/${idTarea}`);
      const tarea = await respuesta.json();

      // Actualizar la tarea con el archivo enviado
      const nuevaTarea = {
        ...tarea,
        tareasEnviadas: [...tarea.tareasEnviadas, archivos[idTarea].name]
      };

      const actualizar = await fetch(`http://localhost:3001/tareas/${idTarea}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea),
      });

      if (actualizar.ok) {
        alert(`Tarea ${idTarea} subida correctamente.`);
        setTareasEnviadas([...tareasEnviadas, idTarea]);
      }
    } catch (error) {
      console.error("Error al subir la tarea:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tareas Asignadas</h2>
      {tareas.map((tarea) => (
        <div key={tarea.id} className="border p-3 mb-3 rounded-lg">
          <h3 className="font-semibold">{tarea.titulo}</h3>
          <p>{tarea.descripcion}</p>
          <p className="text-sm text-gray-500">Entrega: {tarea.fechaEntrega}</p>
          {tarea.archivoProfesor && (
            <p>
              <a href={`/${tarea.archivoProfesor}`} download className="text-blue-600 underline">Descargar archivo</a>
            </p>
          )}
          {tareasEnviadas.includes(tarea.id) ? (
            <p className="text-green-600 font-semibold">Tarea enviada ✔</p>
          ) : (
            <>
              <input type="file" onChange={(e) => manejarArchivo(e, tarea.id)} className="mt-2" />
              <button 
                onClick={() => subirTarea(tarea.id)}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Subir Tarea
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TareasAlumno;

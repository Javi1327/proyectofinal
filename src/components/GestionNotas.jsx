import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, Table } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import "./MisCursos.css";

const GestionNotasUnificado = () => {
  const { user, role } = useUser();
  const backurl = import.meta.env.VITE_URL_BACK || "http://localhost:3000/";

  const [profesor, setProfesor] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [materiaAsignada, setMateriaAsignada] = useState(null);
  const [selectedCurso, setSelectedCurso] = useState("");

  const [selectedAlumnos, setSelectedAlumnos] = useState([]);
  const [tempNotas, setTempNotas] = useState({}); // Notas temporales para edición local
  const [tempPromedios, setTempPromedios] = useState({}); // Promedios temporales para actualización en vivo
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Función helper para calcular promedio
  const calcularPromedio = (nota1, nota2, recuperatorio1, recuperatorio2) => {
    if (nota1 !== undefined && nota2 !== undefined) {
      // Recuperatorios reemplazan directamente a su nota
      const finalNota1 = recuperatorio1 !== undefined ? recuperatorio1 : nota1;
      const finalNota2 = recuperatorio2 !== undefined ? recuperatorio2 : nota2;
      return ((finalNota1 + finalNota2) / 2).toFixed(2);
    }
    return null; // Cambiado de 'Faltan notas'
  };

  useEffect(() => {
    if (!role || role !== "profesor") return;

    axios.get(`${backurl}profesores/${user.id}`)
      .then(res => {
        const prof = res.data.data;
        setProfesor(prof);
        setMateriaAsignada(
          typeof prof.materiaAsignada === "object"
            ? prof.materiaAsignada._id
            : prof.materiaAsignada
        );
        setCursos(prof.cursosAsignados || []);
      })
      .catch(() => toast.error("Error al cargar datos del profesor"));
  }, [user.id, role, backurl]);

  // Actualizar promedios temporales cuando tempNotas cambie
  useEffect(() => {
    const newTempPromedios = {};
    alumnosCurso.forEach(alumno => {
      const mat = alumno.materiasAlumno?.find(ma =>
        (typeof ma.materia === "object"
          ? ma.materia._id
          : ma.materia) === materiaAsignada
      );
      const tempNota1 = tempNotas[`${alumno._id}-nota1`];
      const tempNota2 = tempNotas[`${alumno._id}-nota2`];
      const tempRec1 = tempNotas[`${alumno._id}-notaRecuperatorio1`];
      const tempRec2 = tempNotas[`${alumno._id}-notaRecuperatorio2`];

      // Usar temporales si existen, sino originales
      const finalNota1 = tempRec1 !== undefined ? tempRec1 : (tempNota1 !== undefined ? tempNota1 : mat?.notaRecuperatorio1 !== undefined && mat?.notaRecuperatorio1 !== null ? mat?.notaRecuperatorio1 : mat?.nota1);
      const finalNota2 = tempRec2 !== undefined ? tempRec2 : (tempNota2 !== undefined ? tempNota2 : mat?.notaRecuperatorio2 !== undefined && mat?.notaRecuperatorio2 !== null ? mat?.notaRecuperatorio2 : mat?.nota2);

      // Calcular promedio directamente (igual que calcularPromedio)
      if (finalNota1 !== undefined && finalNota2 !== undefined && finalNota2 !== null) {
        newTempPromedios[alumno._id] = ((finalNota1 + finalNota2) / 2).toFixed(2);
      } else {
        newTempPromedios[alumno._id] = null; // Cambiado de 'Faltan notas'
      }
    });
    setTempPromedios(newTempPromedios);
  }, [tempNotas, alumnosCurso, materiaAsignada]);

  const cargarCurso = async (cursoId) => {
    if (!cursoId) {
      setAlumnosCurso([]);
      setSelectedAlumnos([]);
      setTempNotas({}); // Limpiar notas temporales
      setTempPromedios({}); // Limpiar promedios temporales
      setEditMode(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`${backurl}cursos/${cursoId}/alumnos`);
      const alumnosOrdenados = res.data.data.sort((a, b) =>
        a.apellido.localeCompare(b.apellido)
      );
      setAlumnosCurso(alumnosOrdenados);
      setSelectedCurso(cursoId);
    } catch {
      toast.error("Error al cargar alumnos del curso");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAlumno = (alumnoId) => {
    setSelectedAlumnos(prev =>
      prev.includes(alumnoId)
        ? prev.filter(id => id !== alumnoId)
        : [...prev, alumnoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlumnos.length === alumnosCurso.length) {
      setSelectedAlumnos([]);
    } else {
      setSelectedAlumnos(alumnosCurso.map(a => a._id));
    }
  };

  const activarEditMode = () => {
    if (selectedAlumnos.length === 0) {
      toast.warning("Selecciona al menos un alumno para modificar");
      return;
    }
    setEditMode(true);
  };

  // Actualizar notas temporales localmente
  const handleTempEdit = (alumnoId, field, value) => {
    const key = `${alumnoId}-${field}`;
    setTempNotas(prev => ({
      ...prev,
      [key]: value ? Number(value) : undefined
    }));
  };

  // Guardar cambios (enviar notas temporales al backend)
  const guardarCambios = async () => {
    if (Object.keys(tempNotas).length === 0) {
      toast.warning("No hay cambios para guardar");
      return;
    }

    setIsLoading(true);
    try {
      // Agrupar notas por alumno
      const updatesPorAlumno = {};
      Object.entries(tempNotas).forEach(([key, value]) => {
        const [alumnoId, field] = key.split('-');
        if (!updatesPorAlumno[alumnoId]) updatesPorAlumno[alumnoId] = {};
        updatesPorAlumno[alumnoId][field] = value;
      });

      // Enviar cada actualización
      await Promise.all(
        Object.entries(updatesPorAlumno).map(async ([alumnoId, updates]) => {
          const mat = alumnosCurso.find(a => a._id === alumnoId)?.materiasAlumno?.find(ma =>
            (typeof ma.materia === "object" ? ma.materia._id : ma.materia) === materiaAsignada
          );
          
          // Calcular promedio solo si ambas notas existen
          let promedio = null; // Cambiado de 'Faltan notas'
          if ((updates.nota1 !== undefined || mat?.nota1 !== undefined) && (updates.nota2 !== undefined || mat?.nota2 !== undefined)) {
            const finalNota1 = updates.notaRecuperatorio1 !== undefined ? updates.notaRecuperatorio1 : (updates.nota1 !== undefined ? updates.nota1 : mat?.notaRecuperatorio1 !== undefined && mat?.notaRecuperatorio1 !== null ? mat?.notaRecuperatorio1 : mat?.nota1);
            const finalNota2 = updates.notaRecuperatorio2 !== undefined ? updates.notaRecuperatorio2 : (updates.nota2 !== undefined ? updates.nota2 : mat?.notaRecuperatorio2 !== undefined && mat?.notaRecuperatorio2 !== null ? mat?.notaRecuperatorio2 : mat?.nota2);
            promedio = ((finalNota1 + finalNota2) / 2).toFixed(2);
          }

          const updateData = { ...updates };
          if (promedio !== null) updateData.promedio = promedio; // Solo enviar promedio si no es null

          await axios.put(`${backurl}alumnos/${alumnoId}/notas/${materiaAsignada}`, updateData);
        })
      );

      // Actualizar estado local
      setAlumnosCurso(prev =>
        prev.map(a => {
          const updates = updatesPorAlumno[a._id];
          if (!updates) return a;

          const mat = a.materiasAlumno?.find(ma =>
            (typeof ma.materia === "object" ? ma.materia._id : ma.materia) === materiaAsignada
          );
          if (!mat) {
            // Para nuevos alumnos, crear objeto solo si hay al menos una nota
            if (updates.nota1 !== undefined || updates.nota2 !== undefined || updates.notaRecuperatorio1 !== undefined || updates.notaRecuperatorio2 !== undefined) {
              return {
                ...a,
                materiasAlumno: [
                  ...a.materiasAlumno,
                  {
                    materia: materiaAsignada,
                    ...updates,
                    promedio: calcularPromedio(updates.nota1, updates.nota2, updates.notaRecuperatorio1, updates.notaRecuperatorio2)
                  }
                ]
              };
            }
            return a; // No crear objeto si no hay notas
          }

          // Para alumnos existentes, actualizar
          return {
            ...a,
            materiasAlumno: a.materiasAlumno.map(ma =>
              (typeof ma.materia === "object" ? ma.materia._id : ma.materia) === materiaAsignada
                ? { ...ma, ...updates, promedio: calcularPromedio(
                    updates.nota1 !== undefined ? updates.nota1 : ma.nota1,
                    updates.nota2 !== undefined ? updates.nota2 : ma.nota2,
                    updates.notaRecuperatorio1 !== undefined ? updates.notaRecuperatorio1 : ma.notaRecuperatorio1,
                    updates.notaRecuperatorio2 !== undefined ? updates.notaRecuperatorio2 : ma.notaRecuperatorio2
                  ) }
                : ma
            )
          };
        })
      );

      setTempNotas({}); // Limpiar completamente
      setTempPromedios({}); // Limpiar promedios temporales
      setEditMode(false);
      setSelectedAlumnos([]);
      toast.success("Cambios guardados");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar cambios");
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarLote = async () => {
    if (selectedAlumnos.length === 0) {
      toast.warning("Selecciona al menos un alumno");
      return;
    }
    if (!confirm("¿Limpiar notas de los alumnos seleccionados?")) return;

    setIsLoading(true);
    try {
      await Promise.all(
        selectedAlumnos.map(alumnoId =>
          axios.delete(`${backurl}alumnos/${alumnoId}/notas/${materiaAsignada}`)
        )
      );

      setAlumnosCurso(prev =>
        prev.map(a =>
          selectedAlumnos.includes(a._id)
            ? {
                ...a,
                materiasAlumno: a.materiasAlumno.map(ma =>
                  (typeof ma.materia === "object" ? ma.materia._id : ma.materia) === materiaAsignada
                    ? {
                        ...ma,
                        nota1: undefined,
                        nota2: undefined,
                        notaRecuperatorio1: undefined,
                        notaRecuperatorio2: undefined,
                        promedio: undefined // Cambiado a undefined para que no exista
                      }
                    : ma
                )
              }
            : a
        )
      );
      toast.success("Notas limpiadas en lote");
      setSelectedAlumnos([]);
      setEditMode(false);
    } catch {
      toast.error("Error en limpieza en lote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mis-cursos-page">
      <h2 className="mis-cursos-title">Gestión Unificada de Notas</h2>
      {profesor && materiaAsignada && (
        <p>
          Profesor: <strong>{profesor.nombre} {profesor.apellido}</strong> | Materia: <strong>{profesor.materiaAsignada?.nombreMateria || "N/A"}</strong>
        </p>
      )}

      <div className="mis-cursos-buttons">
        <Form.Select value={selectedCurso} onChange={(e) => cargarCurso(e.target.value)} disabled={isLoading}>
          <option value="">Selecciona un curso</option>
          {cursos.map(curso => (
            <option key={curso._id} value={curso._id}>
              {curso.nombre}
            </option>
          ))}
        </Form.Select>
      </div>

      {selectedCurso && (
        <>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <Button variant="info" onClick={activarEditMode} disabled={isLoading || selectedAlumnos.length === 0}>Modificar Notas</Button>
              <Button variant="success" onClick={guardarCambios} disabled={isLoading || !editMode || Object.keys(tempNotas).length === 0}>Guardar Cambios</Button>
              <Button variant="danger" onClick={eliminarLote} disabled={isLoading}>Limpiar Seleccionados</Button>
            </div>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedAlumnos.length === alumnosCurso.length && alumnosCurso.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Alumno</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Recuperatorio 1</th>
                <th>Recuperatorio 2</th>
                <th>Promedio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {alumnosCurso.map(alumno => {
                const mat = alumno.materiasAlumno?.find(ma =>
                  (typeof ma.materia === "object"
                    ? ma.materia._id
                    : ma.materia) === materiaAsignada
                );

                return (
                  <tr key={alumno._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedAlumnos.includes(alumno._id)}
                        onChange={() => handleSelectAlumno(alumno._id)}
                      />
                    </td>
                    <td>{alumno.apellido}, {alumno.nombre}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        max="10"
                        value={tempNotas[`${alumno._id}-nota1`] !== undefined ? tempNotas[`${alumno._id}-nota1`] : mat?.nota1 || ''}
                        onChange={(e) => handleTempEdit(alumno._id, 'nota1', e.target.value)}
                        disabled={!selectedAlumnos.includes(alumno._id) || !editMode || isLoading}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        max="10"
                        value={tempNotas[`${alumno._id}-nota2`] !== undefined ? tempNotas[`${alumno._id}-nota2`] : mat?.nota2 || ''}
                        onChange={(e) => handleTempEdit(alumno._id, 'nota2', e.target.value)}
                        disabled={!selectedAlumnos.includes(alumno._id) || !editMode || isLoading}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        max="10"
                        value={tempNotas[`${alumno._id}-notaRecuperatorio1`] !== undefined ? tempNotas[`${alumno._id}-notaRecuperatorio1`] : mat?.notaRecuperatorio1 || ''}
                        onChange={(e) => handleTempEdit(alumno._id, 'notaRecuperatorio1', e.target.value)}
                        disabled={!selectedAlumnos.includes(alumno._id) || !editMode || isLoading}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        max="10"
                        value={tempNotas[`${alumno._id}-notaRecuperatorio2`] !== undefined ? tempNotas[`${alumno._id}-notaRecuperatorio2`] : mat?.notaRecuperatorio2 || ''}
                        onChange={(e) => handleTempEdit(alumno._id, 'notaRecuperatorio2', e.target.value)}
                        disabled={!selectedAlumnos.includes(alumno._id) || !editMode || isLoading}
                      />
                    </td>
                    <td>
                      {(() => {
                        const promedio = tempPromedios[alumno._id] !== undefined ? tempPromedios[alumno._id] : mat?.promedio;
                        return promedio === undefined || promedio === null ? 'Faltan notas' : promedio;
                      })()}
                    </td>
                    <td>{mat?.estado || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default GestionNotasUnificado;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import { useUser } from "../context/UserContext"; // <- IMPORTANTE

const MisCursos = () => {
  const { userId } = useUser(); // <- Usar userId desde el contexto
  const [profesor, setProfesor] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursoActivo, setCursoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [materiaAsignada, setMateriaAsignada] = useState(null);

  const [showEditarModal, setShowEditarModal] = useState(false);
  const [alumnoEditar, setAlumnoEditar] = useState(null);
  const [nota1Editar, setNota1Editar] = useState("");
  const [nota2Editar, setNota2Editar] = useState("");

  useEffect(() => {
    if (!userId) return; // Esperar a que se cargue el userId

    axios.get(`http://localhost:3000/profesores/${userId}`)
      .then((response) => {
        const profesorData = response.data.data;
        setProfesor(profesorData);

        const materiaId = typeof profesorData.materiaAsignada === "object"
          ? profesorData.materiaAsignada._id
          : profesorData.materiaAsignada;
        setMateriaAsignada(materiaId);

        axios.get("http://localhost:3000/cursos")
          .then((response) => {
            const cursosTotales = response.data;
            const cursosFiltrados = cursosTotales.filter(curso => {
              const incluyeProfesor = curso.profesores.some(prof => prof._id === userId);
              const incluyeMateria = curso.materias.some(m => m._id === materiaId);
              return incluyeProfesor && incluyeMateria;
            });
            setCursos(cursosFiltrados);
          })
          .catch(() => toast.error("Error al obtener cursos"));
      })
      .catch(() => toast.error("Error al obtener el profesor"));
  }, [userId]);

  const manejarClickCurso = (curso) => {
    if (cursoActivo === curso._id) {
      setCursoActivo(null);
      setShowModal(false);
      setAlumnosCurso([]);
    } else {
      const alumnosOrdenados = [...curso.alumnos].sort((a, b) => {
        const apellidoComp = a.apellido.localeCompare(b.apellido);
        if (apellidoComp !== 0) return apellidoComp;
        return a.nombre.localeCompare(b.nombre);
      });

      setCursoActivo(curso._id);
      setAlumnosCurso(alumnosOrdenados);
      setShowModal(true);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setCursoActivo(null);
    setAlumnosCurso([]);
  };

  const abrirModalEditar = (alumno) => {
    setAlumnoEditar(alumno);
    const materiaAlumno = alumno.materiasAlumno?.find(ma =>
      typeof ma.materia === "object"
        ? ma.materia._id === materiaAsignada
        : ma.materia === materiaAsignada
    );

    if (!materiaAlumno) {
      toast.warning("Este alumno no tiene notas cargadas para esta materia.");
      return;
    }

    setNota1Editar(materiaAlumno.nota1);
    setNota2Editar(materiaAlumno.nota2);
    setShowEditarModal(true);
  };

  const cerrarEditarModal = () => {
    setShowEditarModal(false);
    setAlumnoEditar(null);
    setNota1Editar("");
    setNota2Editar("");
  };

  const handleNotaChange = (setter) => (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val === "") return setter("");
    let num = parseInt(val, 10);
    if (num > 10) num = 10;
    if (num < 1) num = 1;
    setter(num.toString());
  };

  const guardarCambiosNotas = async () => {
    if (
      nota1Editar === "" || nota2Editar === "" ||
      isNaN(nota1Editar) || isNaN(nota2Editar) ||
      parseInt(nota1Editar, 10) < 1 || parseInt(nota1Editar, 10) > 10 ||
      parseInt(nota2Editar, 10) < 1 || parseInt(nota2Editar, 10) > 10
    ) {
      toast.error("Por favor ingresa notas válidas entre 1 y 10.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/alumnos/${alumnoEditar._id}/notas/${materiaAsignada}`, {
        nota1: parseInt(nota1Editar, 10),
        nota2: parseInt(nota2Editar, 10),
      });

      setAlumnosCurso((prevAlumnos) =>
        prevAlumnos.map((alumno) => {
          if (alumno._id === alumnoEditar._id) {
            const materiasActualizadas = alumno.materiasAlumno.map((ma) => {
              const idMateria = typeof ma.materia === "object" ? ma.materia._id : ma.materia;
              if (idMateria === materiaAsignada) {
                return {
                  ...ma,
                  nota1: parseInt(nota1Editar, 10),
                  nota2: parseInt(nota2Editar, 10),
                  promedio: ((parseInt(nota1Editar, 10) + parseInt(nota2Editar, 10)) / 2).toFixed(2),
                };
              }
              return ma;
            });
            return { ...alumno, materiasAlumno: materiasActualizadas };
          }
          return alumno;
        }).sort((a, b) => a.apellido.localeCompare(b.apellido))
      );

      toast.success("Notas actualizadas correctamente");
      cerrarEditarModal();
    } catch (error) {
      toast.error("Error al actualizar las notas");
    }
  };

  return (
    <div>
      <h2>Mis Cursos</h2>
      {!userId ? (
        <p>Cargando ID del usuario...</p>
      ) : profesor ? (
        cursos.length > 0 ? (
          cursos.map((curso) => (
            <div key={curso._id} style={{ marginBottom: "1.5rem" }}>
              <button
                onClick={() => manejarClickCurso(curso)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0275BC",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                {curso.nombre}
              </button>
            </div>
          ))
        ) : (
          <p>No tienes cursos asignados para esta materia.</p>
        )
      ) : (
        <p>Cargando datos del profesor...</p>
      )}

      {/* Modal de alumnos */}
      <Modal show={showModal} onHide={cerrarModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Alumnos del curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alumnosCurso.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th className="text-start">Alumno</th>
                    <th>Nota 1</th>
                    <th>Nota 2</th>
                    <th>Promedio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosCurso.map(alumno => {
                    const materiaAlumno = alumno.materiasAlumno?.find(ma =>
                      typeof ma.materia === 'object'
                        ? ma.materia._id === materiaAsignada
                        : ma.materia === materiaAsignada
                    );

                    return (
                      <tr key={alumno._id}>
                        <td className="text-start">{alumno.apellido}, {alumno.nombre}</td>
                        {materiaAlumno ? (
                          <>
                            <td>{materiaAlumno.nota1}</td>
                            <td>{materiaAlumno.nota2}</td>
                            <td>{materiaAlumno.promedio ?? ((materiaAlumno.nota1 + materiaAlumno.nota2) / 2).toFixed(2)}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => abrirModalEditar(alumno)}
                                title="Editar notas"
                                style={{ fontSize: "1.2rem" }}
                              >
                                ✏️
                              </button>
                            </td>
                          </>
                        ) : (
                          <td colSpan="4">
                            <em>Este alumno no tiene notas cargadas para esta materia.</em>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay alumnos en este curso.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición de notas */}
      <Modal show={showEditarModal} onHide={cerrarEditarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar notas de {alumnoEditar?.nombre} {alumnoEditar?.apellido}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nota1">
              <Form.Label>Nota 1</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                step="1"
                value={nota1Editar}
                onChange={handleNotaChange(setNota1Editar)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nota2">
              <Form.Label>Nota 2</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                step="1"
                value={nota2Editar}
                onChange={handleNotaChange(setNota2Editar)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarEditarModal}>Cancelar</Button>
          <Button variant="primary" onClick={guardarCambiosNotas}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default MisCursos;

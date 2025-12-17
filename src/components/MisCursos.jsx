import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import "./MisCursos.css";

const MisCursos = () => {
  const { userId } = useUser();

  const [profesor, setProfesor] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [materiaAsignada, setMateriaAsignada] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);

  const [alumnoEditar, setAlumnoEditar] = useState(null);
  const [nota1Editar, setNota1Editar] = useState("");
  const [nota2Editar, setNota2Editar] = useState("");

  /* =============================
     CARGA PROFESOR Y CURSOS
  ============================== */
  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:3000/profesores/${userId}`)
      .then(res => {
        const prof = res.data.data;
        setProfesor(prof);

        const materiaId =
          typeof prof.materiaAsignada === "object"
            ? prof.materiaAsignada._id
            : prof.materiaAsignada;

        setMateriaAsignada(materiaId);
        return axios.get("http://localhost:3000/cursos");
      })
      .then(res => {
        const filtrados = res.data.filter(curso =>
          curso.profesores.some(p => p._id === userId) &&
          curso.materias.some(m =>
            typeof m === "object" ? m._id === materiaAsignada : m === materiaAsignada
          )
        );
        setCursos(filtrados);
      })
      .catch(() => toast.error("Error al cargar datos"));
  }, [userId, materiaAsignada]);

  /* =============================
     MANEJO DE CURSO
  ============================== */
  const abrirCurso = (curso) => {
    const alumnosOrdenados = [...curso.alumnos].sort((a, b) =>
      a.apellido.localeCompare(b.apellido)
    );
    setAlumnosCurso(alumnosOrdenados);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setAlumnosCurso([]);
  };

  /* =============================
     MODAL EDITAR
  ============================== */
  const abrirModalEditar = (alumno) => {
    const materiaAlumno = alumno.materiasAlumno?.find(ma =>
      typeof ma.materia === "object"
        ? ma.materia._id === materiaAsignada
        : ma.materia === materiaAsignada
    );

    if (!materiaAlumno) {
      toast.warning("Este alumno no tiene notas cargadas.");
      return;
    }

    setAlumnoEditar(alumno);
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

  const guardarCambiosNotas = async () => {
    try {
      await axios.put(
        `http://localhost:3000/alumnos/${alumnoEditar._id}/notas/${materiaAsignada}`,
        {
          nota1: Number(nota1Editar),
          nota2: Number(nota2Editar),
        }
      );

      setAlumnosCurso(prev =>
        prev.map(a =>
          a._id === alumnoEditar._id
            ? {
                ...a,
                materiasAlumno: a.materiasAlumno.map(ma =>
                  (typeof ma.materia === "object"
                    ? ma.materia._id
                    : ma.materia) === materiaAsignada
                    ? {
                        ...ma,
                        nota1: Number(nota1Editar),
                        nota2: Number(nota2Editar),
                        promedio: ((Number(nota1Editar) + Number(nota2Editar)) / 2).toFixed(2),
                      }
                    : ma
                ),
              }
            : a
        )
      );

      toast.success("Notas actualizadas");
      cerrarEditarModal();
    } catch {
      toast.error("Error al guardar notas");
    }
  };

  /* =============================
     RENDER
  ============================== */
  return (
    <div className="mis-cursos-page">
      <h2 className="mis-cursos-title">Mis Cursos</h2>

      <div className="mis-cursos-buttons">
        {cursos.map(curso => (
          <button
            key={curso._id}
            className="mis-cursos-btn"
            onClick={() => abrirCurso(curso)}
          >
            {curso.nombre}
          </button>
        ))}
      </div>


   {/* MODAL CURSO */}
  <Modal
    show={showModal}
    onHide={cerrarModal}
    dialogClassName="mis-cursos-modal"
    size="xl"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Alumnos del curso</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Nota 1</th>
              <th>Nota 2</th>
              <th>Promedio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnosCurso.map(alumno => {
              const mat = alumno.materiasAlumno?.find(ma =>
                typeof ma.materia === "object"
                  ? ma.materia._id === materiaAsignada
                  : ma.materia === materiaAsignada
              );

              return (
                <tr key={alumno._id}>
                  <td>{alumno.apellido}, {alumno.nombre}</td>

                  {mat ? (
                    <>
                      <td>{mat.nota1}</td>
                      <td>{mat.nota2}</td>
                      <td>{mat.promedio}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => abrirModalEditar(alumno)}
                        >
                          ✏️
                        </button>
                      </td>
                    </>
                  ) : (
                    <td colSpan="4">
                      <em>Sin notas cargadas</em>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={cerrarModal}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>

      {/* MODAL EDITAR */}
      <Modal show={showEditarModal} onHide={cerrarEditarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar notas</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nota 1</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={nota1Editar}
                onChange={(e) => setNota1Editar(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nota 2</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={nota2Editar}
                onChange={(e) => setNota2Editar(e.target.value)}
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

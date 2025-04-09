import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './AdminUsuarios.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUsuarios = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [grado, setGrado] = useState('');
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  const roleRoutes = {
    alumno: "alumnos",
    profesor: "profesores",
    preceptor: "preceptores",
    admin: "admins",
  };

  useEffect(() => {
    if (selectedRole === 'profesor') {
      axios.get('http://localhost:3000/materias')
        .then((response) => {
          setMaterias(response.data);
        })
        .catch((error) => console.error('Error al obtener materias:', error));
    }
  }, [selectedRole]);

  useEffect(() => {
    if (materiaSeleccionada && materias.length > 0) {
      const materia = materias.find((m) => m._id === materiaSeleccionada);
      if (materia && materia.cursos) {
        setCursosFiltrados(materia.cursos);
      }
    } else {
      setCursosFiltrados([]);
    }
  }, [materiaSeleccionada, materias]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedRole('');
    setNombre('');
    setApellido('');
    setDni('');
    setCorreoElectronico('');
    setTelefono('');
    setDireccion('');
    setGrado('');
    setMateriaSeleccionada('');
    setFechaNacimiento('');
    setCursoSeleccionado('');
  };

  const handleShow = () => setShowModal(true);

  const validarCampos = () => {
    if (!selectedRole) return toast.error("Seleccioná un rol."), false;
    if (!nombre.trim() || !apellido.trim()) return toast.error("Nombre y apellido son obligatorios."), false;
    if (!dni.trim() || !/^\d{8}$/.test(dni)) return toast.error("DNI inválido. Debe tener 8 dígitos."), false;

    switch (selectedRole) {
      case 'profesor':
        if (!correoElectronico.trim() || !materiaSeleccionada || !cursoSeleccionado) {
          toast.error("Todos los campos para profesor son obligatorios.");
          return false;
        }
        break;
      case 'alumno':
        if (!grado || !direccion.trim() || !fechaNacimiento) {
          toast.error("Todos los campos para alumno son obligatorios.");
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;
  
    try {
      const endpoint = roleRoutes[selectedRole];
      const modelos = ['admins', 'alumnos', 'profesores', 'preceptores'];
  
      // Validar DNI globalmente
      const dniDuplicado = await Promise.any(
        modelos.map((ruta) =>
          axios
            .get(`http://localhost:3000/${ruta}/buscar?dni=${dni}`)
            .then(() => true) // Lo encontró → duplicado
            .catch((err) => {
              if (err.response?.status === 404) return false; // No encontrado → no es duplicado
              throw err; // Otro error (servidor, etc) → reventar
            })
        )
      ).catch((error) => {
        if (error instanceof AggregateError) return false; // Ninguno lo encontró
        throw error; // Error inesperado
      });
      
      if (dniDuplicado) {
        toast.error("Ya existe un usuario con ese DNI en el sistema.");
        return;
      }
      
      // Validar correo electrónico si está presente
      if (correoElectronico) {
        const correoDuplicado = await Promise.any(
          modelos.map((ruta) =>
            axios
              .get(`http://localhost:3000/${ruta}/buscar?correoElectronico=${correoElectronico}`)
              .then(() => true)
              .catch((err) => {
                if (err.response?.status === 404) return false;
                throw err;
              })
          )
        ).catch((error) => {
          if (error instanceof AggregateError) return false;
          throw error;
        });
      
        if (correoDuplicado) {
          toast.error("Ya existe un usuario con ese correo electrónico.");
          return;
        }
      }
      
  
      // Si llegamos acá, todo está OK para crear el usuario
      const newUserData = {
        nombre,
        apellido,
        dni: Number(dni),
        correoElectronico,
        telefono,
        direccion,
        grado,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento).toISOString() : null,
      };
  
      if (selectedRole === 'profesor') {
        newUserData.materiasAsignadas = [materiaSeleccionada];
        newUserData.cursosAsignados = [cursoSeleccionado];
      }
  
      if (selectedRole === 'alumno') {
        newUserData.materiasAlumno = [];
      }
  
      // Eliminar campos vacíos
      Object.keys(newUserData).forEach(
        (key) =>
          (newUserData[key] === '' || newUserData[key] === null || newUserData[key] === undefined) &&
          delete newUserData[key]
      );
  
      await axios.post(`http://localhost:3000/${endpoint}`, newUserData);
      toast.success("Usuario creado con éxito!");
      handleClose();
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      toast.error("Hubo un error al crear el usuario.");
    }
  };
  

  return (
    <div className="admin-usuarios-container">
      <h2>Administrar Usuarios</h2>
      <button className="btn-action" onClick={handleShow}>Crear Usuario</button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRol">
              <Form.Label>Seleccionar Rol</Form.Label>
              <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="profesor">Profesor</option>
                <option value="preceptor">Preceptor</option>
                <option value="alumno">Alumno</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </Form.Group>

            {['admin', 'profesor', 'preceptor', 'alumno'].includes(selectedRole) && (
              <Form.Group controlId="formDni">
                <Form.Label>DNI</Form.Label>
                <Form.Control type="text" value={dni} onChange={(e) => setDni(e.target.value)} />
              </Form.Group>
            )}

            {['admin', 'profesor', 'preceptor', 'alumno'].includes(selectedRole) && (
              <>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={correoElectronico} onChange={(e) => setCorreoElectronico(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </Form.Group>
              </>
            )}

            {selectedRole === 'profesor' && (
              <>
                <Form.Group controlId="formMateria">
                  <Form.Label>Materia</Form.Label>
                  <Form.Control as="select" value={materiaSeleccionada} onChange={(e) => setMateriaSeleccionada(e.target.value)}>
                    <option value="">Seleccione una materia</option>
                    {materias.map((materia) => (
                      <option key={materia._id} value={materia._id}>
                        {materia.nombreMateria}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formCurso">
                  <Form.Label>Curso</Form.Label>
                  <Form.Control as="select" value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)}>
                    <option value="">Seleccione un curso</option>
                    {cursosFiltrados.map((curso, index) => (
                      <option key={index} value={curso}>
                        {curso}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}

            {selectedRole === 'alumno' && (
              <>
                <Form.Group controlId="formGrado">
                  <Form.Label>Grado</Form.Label>
                  <Form.Control as="select" value={grado} onChange={(e) => setGrado(e.target.value)}>
                    <option value="">Seleccione un grado</option>
                    {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formDireccion">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSubmit}>Crear Usuario</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AdminUsuarios;

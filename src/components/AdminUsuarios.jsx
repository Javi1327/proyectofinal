import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
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
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");



  const roleRoutes = {
    alumno: "alumnos",
    profesor: "profesores",
    preceptor: "preceptores",
    admin: "admins",
  };

  // Obtener las materias para el profesor
  useEffect(() => {
    if (selectedRole === 'profesor') {
      axios.get('http://localhost:3000/materias')  // Asegúrate de que la URL del backend es correcta
        .then((response) => {
          // Verificamos la estructura de la respuesta y ajustamos la carga
          setMaterias(response.data);
          console.log("Materias desde backend:", response.data); // log para verificar las materias, despues sacar

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
  };

  const handleShow = () => setShowModal(true);
  

    const handleSubmit = async () => {
      try {
        const newUserData = {
          selectedRole,
          nombre,
          apellido,
          dni:Number(dni),
          correoElectronico,
          telefono,
          direccion,
          grado,
          materiaSeleccionada,
          cursoSeleccionado,
          fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento).toISOString() : null,
          materias: [
            {
              idMateria: materiaSeleccionada,
              cursosAsignados: [cursoSeleccionado]
            }
          ]
        };

            // Eliminar campos vacíos o no aplicables
    Object.keys(newUserData).forEach((key) => {
        if (
          newUserData[key] === "" ||
          newUserData[key] === null ||
          newUserData[key] === undefined
        ) {
          delete newUserData[key];
        }
      });
    
        console.log(newUserData)
        // Enviar los datos al backend
        const endpoint = roleRoutes[selectedRole];
        const response = await axios.post(`http://localhost:3000/${endpoint}`, newUserData);
        console.log('Usuario creado:', response.data);
        
        // Mostrar mensaje de éxito usando Toast
         toast.success("Usuario creado con éxito!");

        // Cerrar el formulario después de enviar
        handleClose();
      } catch (error) {
        console.error('Error al crear el usuario:', error);
        toast.error("Hubo un error al crear el usuario.");
      }
    };
    
  return (
    <div className="admin-usuarios-container">
      <h2>Administrar Usuarios</h2>

      <button className="btn-action" onClick={handleShow}>Crear Usuario</button>

      {/* Modal de creación de usuario */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Selección de Rol */}
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

            {/* Nombre y Apellido siempre visibles */}
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </Form.Group>

            {/* Campos según el rol seleccionado */}
            {selectedRole === 'admin' && (
              <>
                <Form.Group controlId="formDni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {selectedRole === 'profesor' && (
              <>
                <Form.Group controlId="formDni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formMateria">
                        <Form.Label>Materia</Form.Label>
                        <Form.Control
                            as="select"
                            value={materiaSeleccionada}
                            onChange={(e) => setMateriaSeleccionada(e.target.value)}
                        >
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
                        <Form.Control
                            as="select"
                            value={cursoSeleccionado}
                            onChange={(e) => setCursoSeleccionado(e.target.value)}
                        >
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

            {selectedRole === 'preceptor' && (
              <>
                <Form.Group controlId="formDni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {selectedRole === 'alumno' && (
              <>
                <Form.Group controlId="formDni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formGrado">
                  <Form.Label>Grado</Form.Label>
                  <Form.Control
                    as="select"
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                  >
                    <option value="1A">1A</option>
                    <option value="1B">1B</option>
                    <option value="2A">2A</option>
                    <option value="2B">2B</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formDireccion">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formFechaNacimiento">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Crear Usuario
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default AdminUsuarios;



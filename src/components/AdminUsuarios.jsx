import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Table, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './AdminUsuarios.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const AdminUsuarios = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
  const [cursoSeleccionado, setCursoSeleccionado] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioDetalles, setUsuarioDetalles] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [ordenColumna, setOrdenColumna] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const opcionesCursos = cursosFiltrados.map(curso => ({
    value: curso._id,
    label: curso.nombre
  }));

  const roleRoutes = {
    alumno: "alumnos",
    profesor: "profesores",
    preceptor: "preceptores",
    admin: "admins",
  };

  const cargarUsuarios = useCallback(async () => {
    try {
      const rutas = ['alumnos', 'profesores', 'preceptores', 'admins'];
      const promesas = rutas.map(ruta => axios.get(`http://localhost:3000/${ruta}`));
      const resultados = await Promise.allSettled(promesas);
      
      const todosUsuarios = [];
      resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled') {
          const ruta = rutas[index];
          const rolMap = {
            'alumnos': 'alumno',
            'profesores': 'profesor',
            'preceptores': 'preceptor',
            'admins': 'admin'
          };
          const rol = rolMap[ruta];
          const response = resultado.value.data;
          if (response && Array.isArray(response.data)) {
            response.data.forEach(usuario => {
              todosUsuarios.push({ ...usuario, rol });
            });
          } else {
            console.warn(`Datos de ${ruta} no son un array válido:`, response);
          }
        } else {
          console.warn(`Error al cargar ${rutas[index]}:`, resultado.reason);
        }
      });
      const usuariosActivos = todosUsuarios.filter(usuario => usuario.isHabilitado !== false);
      setUsuarios(usuariosActivos);
    } catch (error) {
      console.error('Error general al cargar usuarios:', error);
      toast.error('Error al cargar usuarios.');
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const cargarDatosProfesor = useCallback(async () => {
    try {
      const [materiasRes, cursosRes] = await Promise.all([
        axios.get('http://localhost:3000/materias'),
        axios.get('http://localhost:3000/cursos')
      ]);
      setMaterias(materiasRes.data);
      setCursosFiltrados(cursosRes.data);
    } catch (error) {
      console.error('Error al cargar datos de profesor:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedRole === 'profesor') {
      cargarDatosProfesor();
    }
  }, [selectedRole, cargarDatosProfesor]);

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
    setCursoSeleccionado([]);
    setUsuarioEditando(null);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setUsuarioDetalles(null);
  };

  const handleShow = () => {
    setUsuarioEditando(null);
    setShowModal(true);
  };

  const handleEditar = async (usuario) => {
    console.log('Editando usuario:', usuario);  // Log adicional: datos del usuario a editar
    console.log('Rol del usuario:', usuario.rol);  // Log adicional: rol
    setUsuarioEditando(usuario);
    setSelectedRole(usuario.rol);
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setDni(usuario.dni.toString());
    setCorreoElectronico(usuario.correoElectronico || '');
    setTelefono(usuario.telefono || '');
    setDireccion(usuario.direccion || '');
    setGrado(usuario.grado || '');
    setFechaNacimiento(usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString().split('T')[0] : '');
    setCursoSeleccionado(usuario.cursosAsignados || []);

    if (usuario.rol === 'profesor') {
      await cargarDatosProfesor();
      setMateriaSeleccionada(usuario.materiaAsignada || '');
    }

    setShowModal(true);
  };

  const handleVerDetalles = async (usuario) => {
    const usuarioParaDetalles = { ...usuario };

    if (usuario.rol === 'alumno' && usuario.grado) {
      if (typeof usuario.grado === 'object' && usuario.grado.nombre) {
        usuarioParaDetalles.grado = usuario.grado.nombre;
      } else {
        try {
          const cursoRes = await axios.get(`http://localhost:3000/cursos/${usuario.grado}`);
          if (cursoRes.data && cursoRes.data.data && cursoRes.data.data.nombre) {
            usuarioParaDetalles.grado = cursoRes.data.data.nombre;
          } else if (cursoRes.data && cursoRes.data.nombre) {
            usuarioParaDetalles.grado = cursoRes.data.nombre;
          } else {
            usuarioParaDetalles.grado = usuario.grado;
          }
        } catch (error) {
          console.error('Error al poblar grado:', error);
          usuarioParaDetalles.grado = usuario.grado;
        }
      }
    }

    if (usuario.rol === 'profesor') {
      if (usuario.materiaAsignada) {
        if (typeof usuario.materiaAsignada === 'object' && usuario.materiaAsignada.nombreMateria) {
          usuarioParaDetalles.materiaAsignada = usuario.materiaAsignada.nombreMateria;
        } else {
          try {
            const materiaRes = await axios.get(`http://localhost:3000/materias/${usuario.materiaAsignada}`);
            usuarioParaDetalles.materiaAsignada = materiaRes.data.data.nombreMateria || 'N/A';
          } catch (error) {
            console.error('Error al poblar materia:', error);
            usuarioParaDetalles.materiaAsignada = 'N/A';
          }
        }
      } else {
        usuarioParaDetalles.materiaAsignada = 'N/A';
      }

      if (usuario.cursosAsignados && usuario.cursosAsignados.length > 0) {
        try {
          const cursosRes = await axios.get('http://localhost:3000/cursos');
          const cursosMap = cursosRes.data.reduce((map, curso) => {
            map[curso._id] = curso.nombre;
            return map;
          }, {});
          usuarioParaDetalles.cursosAsignados = usuario.cursosAsignados.map(id => cursosMap[id] || id);
        } catch (error) {
          console.error('Error al poblar cursos:', error);
        }
      }
    }

    setUsuarioDetalles(usuarioParaDetalles);
    setShowDetailsModal(true);
  };

  const handleOrdenar = (columna) => {
    if (ordenColumna === columna) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenColumna(columna);
      setOrdenAscendente(true);
    }
  };

  const handleEliminar = async (usuario) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
      try {
        const endpoint = roleRoutes[usuario.rol];
        if (!endpoint) {
          console.error("Rol no válido:", usuario.rol);
          toast.error("Rol de usuario no válido para eliminación.");
          return;
        }
        console.log("Eliminando usuario:", usuario._id, "en endpoint:", endpoint);
        await axios.put(`http://localhost:3000/${endpoint}/${usuario._id}`, { isHabilitado: false });
        toast.success("Usuario eliminado con éxito!");
        cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar usuario.");
      }
    }
  };

  const validarCampos = () => {
    if (!selectedRole) return toast.error("Seleccioná un rol."), false;
    if (!nombre.trim() || !apellido.trim()) return toast.error("Nombre y apellido son obligatorios."), false;
    if (!dni.trim() || !/^\d{8}$/.test(dni)) return toast.error("DNI inválido. Debe tener 8 dígitos."), false;

    switch (selectedRole) {
      case 'profesor':
        if (!correoElectronico.trim() || !materiaSeleccionada || !cursoSeleccionado.length) {
          toast.error("Todos los campos para profesor son obligatorios.");
          return false;
        }
        break;
      case 'alumno':
        if (!usuarioEditando && (!grado || !direccion.trim() || !fechaNacimiento)) {
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
      const isEdit = !!usuarioEditando;
      const url = isEdit ? `http://localhost:3000/${endpoint}/${usuarioEditando._id}` : `http://localhost:3000/${endpoint}`;
      const method = isEdit ? 'put' : 'post';

      const modelos = ['admins', 'alumnos', 'profesores', 'preceptores'];

      if (!isEdit || dni !== usuarioEditando.dni.toString()) {
        const dniDuplicado = await Promise.any(
          modelos.map((ruta) =>
            axios
              .get(`http://localhost:3000/${ruta}/buscar?dni=${dni}`)
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

        if (dniDuplicado) {
          toast.error("Ya existe un usuario con ese DNI en el sistema.");
          return;
        }
      }

      if (correoElectronico && (!isEdit || correoElectronico !== usuarioEditando.correoElectronico)) {
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

      const newUserData = {
  nombre,
  apellido,
  dni: Number(dni),
  correoElectronico,
  telefono: telefono || undefined,  // Mantener como String por defecto
};

if (selectedRole === 'profesor') {
  newUserData.materiaAsignada = materiaSeleccionada;
  newUserData.cursosAsignados = Array.isArray(cursoSeleccionado)
    ? cursoSeleccionado
    : [cursoSeleccionado];
  newUserData.telefono = telefono ? Number(telefono) : undefined;  // Convertir a Number para profesor
} else if (selectedRole === 'alumno') {
  newUserData.direccion = direccion;
  newUserData.grado = grado;
  newUserData.fechaNacimiento = fechaNacimiento ? new Date(fechaNacimiento).toISOString() : null;
  newUserData.materiasAlumno = [];
  // telefono queda como String
} else if (['admin', 'preceptor'].includes(selectedRole)) {
  newUserData.telefono = telefono ? Number(telefono) : undefined;  // Convertir a Number para admin/preceptor
  if (isEdit) {
    newUserData.isHabilitado = usuarioEditando.isHabilitado;  // Agregar isHabilitado en edición
  }
}

      Object.keys(newUserData).forEach(
        (key) => {
          const value = newUserData[key];
          const isEmptyArray = Array.isArray(value) && value.length === 0;
          const isEmptyString = value === '' || value === null || value === undefined;
          if (isEmptyArray || isEmptyString) {
            delete newUserData[key];
          }
        }
      );

      // Logs para debug
      console.log('Datos enviados al backend:', newUserData);
      console.log('Rol seleccionado:', selectedRole);
      console.log('URL:', url);

      await axios[method](url, newUserData);
      toast.success(isEdit ? "Usuario actualizado con éxito!" : "Usuario creado con éxito!");
      handleClose();
      cargarUsuarios();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hubo un error.");
    }
  };

  const estadisticas = {
    total: usuarios.length,
    alumnos: usuarios.filter(u => u.rol === 'alumno').length,
    profesores: usuarios.filter(u => u.rol === 'profesor').length,
    preceptores: usuarios.filter(u => u.rol === 'preceptor').length,
    admins: usuarios.filter(u => u.rol === 'admin').length,
  };

  const usuariosFiltradosOrdenados = usuarios
    .filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.dni.toString().includes(busqueda)
    )
    .filter(usuario => !filtroRol || usuario.rol === filtroRol)
    .sort((a, b) => {
      if (!ordenColumna) return 0;
      const aValue = a[ordenColumna] || '';
      const bValue = b[ordenColumna] || '';
      if (ordenAscendente) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="admin-usuarios-container">
      <h2>Administrar Usuarios</h2>
      
      <Row className="mb-3">
        <Col><strong>Total Usuarios: {estadisticas.total}</strong></Col>
        <Col>Alumnos: {estadisticas.alumnos}</Col>
        <Col>Profesores: {estadisticas.profesores}</Col>
        <Col>Preceptores: {estadisticas.preceptores}</Col>
        <Col>Admins: {estadisticas.admins}</Col>
      </Row>

      <div className="admin-usuarios-actions">
        <button className="admin-usuarios-btn" onClick={handleShow}>
          Crear Usuario
        </button>
      </div>

      <div className="admin-usuarios-search">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nombre, apellido o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>
        <Form.Select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="mb-3"
        >
          <option value="">Todos los roles</option>
          <option value="alumno">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="preceptor">Preceptor</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleOrdenar('nombre')} style={{ cursor: 'pointer' }}>
              Nombre {ordenColumna === 'nombre' && (ordenAscendente ? '↑' : '↓')}
            </th>
            <th onClick={() => handleOrdenar('apellido')} style={{ cursor: 'pointer' }}>
              Apellido {ordenColumna === 'apellido' && (ordenAscendente ? '↑' : '↓')}
            </th>
            <th onClick={() => handleOrdenar('dni')} style={{ cursor: 'pointer' }}>
              DNI {ordenColumna === 'dni' && (ordenAscendente ? '↑' : '↓')}
            </th>
            <th onClick={() => handleOrdenar('rol')} style={{ cursor: 'pointer' }}>
              Rol {ordenColumna === 'rol' && (ordenAscendente ? '↑' : '↓')}
            </th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
                <tbody>
          {usuariosFiltradosOrdenados.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.dni}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.correoElectronico || 'N/A'}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleVerDetalles(usuario)}>
                  Ver Detalles
                </Button>{' '}
                <Button variant="warning" size="sm" onClick={() => handleEditar(usuario)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleEliminar(usuario)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{usuarioEditando ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRol">
              <Form.Label>Seleccionar Rol</Form.Label>
              <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} disabled={!!usuarioEditando}>
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
                  <Form.Label>Cursos Asignados</Form.Label>
                  <Select
                    isMulti
                    options={opcionesCursos}
                    value={cursoSeleccionado.map(cursoId => {
                      const curso = cursosFiltrados.find(c => c._id === cursoId);
                      return curso ? { value: curso._id, label: curso.nombre } : null;
                    }).filter(Boolean)}
                    onChange={(selectedOptions) => {
                      const selectedCursos = selectedOptions ? selectedOptions.map(option => option.value) : [];
                      setCursoSeleccionado(selectedCursos);
                    }}
                    placeholder="Selecciona uno o más cursos"
                  />
                </Form.Group>
              </>
            )}

            {selectedRole === 'alumno' && (
              <>
                {!usuarioEditando && (
                  <Form.Group controlId="formGrado">
                    <Form.Label>Grado</Form.Label>
                    <Form.Control as="select" value={grado} onChange={(e) => setGrado(e.target.value)}>
                      <option value="">Seleccione un grado</option>
                      {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}

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
          <Button variant="primary" onClick={handleSubmit}>
            {usuarioEditando ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioDetalles && (
            <div>
              <p><strong>Nombre:</strong> {usuarioDetalles.nombre}</p>
              <p><strong>Apellido:</strong> {usuarioDetalles.apellido}</p>
              <p><strong>DNI:</strong> {usuarioDetalles.dni}</p>
              <p><strong>Rol:</strong> {usuarioDetalles.rol}</p>
              <p><strong>Email:</strong> {usuarioDetalles.correoElectronico || 'N/A'}</p>
              <p><strong>Teléfono:</strong> {usuarioDetalles.telefono || 'N/A'}</p>
              {usuarioDetalles.rol === 'alumno' && (
                <>
                  <p><strong>Grado:</strong> {usuarioDetalles.grado || 'N/A'}</p>
                  <p><strong>Dirección:</strong> {usuarioDetalles.direccion || 'N/A'}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {usuarioDetalles.fechaNacimiento ? new Date(usuarioDetalles.fechaNacimiento).toLocaleDateString() : 'N/A'}</p>
                </>
              )}
              {usuarioDetalles.rol === 'profesor' && (
                <>
                  <p><strong>Materia Asignada:</strong> {usuarioDetalles.materiaAsignada || 'N/A'}</p>
                  <p><strong>Cursos Asignados:</strong> {usuarioDetalles.cursosAsignados?.join(', ') || 'N/A'}</p>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AdminUsuarios;
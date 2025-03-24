import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const grados = [
    '1A', '1B', '2A', '2B', '3A', '3B',
    '4A', '4B', '5A', '5B', '6A', '6B',
  ];

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    rol: 'alumno',
    grado: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    materias: [],
    cursos: [],
    fechaContratacion: new Date(),
    fechaNacimiento: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { nombre, dni, apellido, correoElectronico, fechaNacimiento } = formData;
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return false;
    }
    if (!/^\d{7,8}$/.test(dni)) {
      setError('El DNI debe ser numérico y tener entre 7 y 8 caracteres.');
      return false;
    }
    if (formData.rol === 'profesor' && !correoElectronico) {
      setError('El correo electrónico es obligatorio para los profesores.');
      return false;
    }
    if (formData.rol === 'preceptor' && !apellido) {
      setError('El apellido es obligatorio para los preceptores.');
      return false;
    }
    if (formData.rol === 'alumno' && !fechaNacimiento) {
      setError('La fecha de nacimiento es obligatoria para los alumnos.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!validateForm()) return;

    const payload = { ...formData };

    if (payload.rol === 'alumno') {
      delete payload.materias;
      delete payload.cursos;
      delete payload.fechaContratacion;
    } else if (payload.rol === 'preceptor') {
      delete payload.materias;
      delete payload.cursos;
      delete payload.fechaContratacion;
      delete payload.grado;
      delete payload.fechaNacimiento;
    } else if (payload.rol === 'profesor') {
      if (typeof payload.materias === 'string') {
        payload.materias = payload.materias.split(',').map((m) => m.trim());
      }
      delete payload.grado;
      delete payload.fechaNacimiento;
    } else if (payload.rol === 'admin') {
      delete payload.materias;
      delete payload.cursos;
      delete payload.fechaContratacion;
      delete payload.grado;
      delete payload.fechaNacimiento;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BACK}usuarios/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el usuario');
      }

      setSuccessMessage('Usuario creado con éxito');
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        rol: 'alumno',
        grado: '',
        direccion: '',
        telefono: '',
        correoElectronico: '',
        materias: [],
        cursos: [],
        fechaContratacion: new Date(),
        fechaNacimiento: '',
      });

      navigate('/admin/ver-usuarios');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error de conexión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos comunes */}
      <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
      <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} />
      <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleInputChange} />
      
      <select name="rol" value={formData.rol} onChange={handleInputChange}>
        <option value="alumno">Alumno</option>
        <option value="profesor">Profesor</option>
        <option value="preceptor">Preceptor</option>
        <option value="admin">Administrador</option>
      </select>

      {/* Campos condicionales */}
      {formData.rol === 'alumno' && (
        <>
          <select name="grado" value={formData.grado} onChange={handleInputChange}>
            <option value="">Seleccionar curso</option>
            {grados.map((grado) => (
              <option key={grado} value={grado}>{grado}</option>
            ))}
          </select>
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} />
        </>
      )}

      {formData.rol === 'profesor' && (
        <>
          <input type="email" name="correoElectronico" placeholder="Correo Electrónico" value={formData.correoElectronico} onChange={handleInputChange} />
          <input type="text" name="materias" placeholder="Materias (separadas por coma)" value={formData.materias} onChange={handleInputChange} />
        </>
      )}

      {formData.rol === 'preceptor' && (
        <>
          <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} />
          <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
        </>
      )}

      {/* Mensajes */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <button type="submit">Crear Usuario</button>
    </form>
  );
};

export default CrearUsuario;







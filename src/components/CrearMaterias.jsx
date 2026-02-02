import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CrearMaterias.css';

const CrearMateria = () => {
  const backurl = import.meta.env.VITE_URL_BACK;

  const [nombreMateria, setNombreMateria] = useState('');
  const [selectedCursos, setSelectedCursos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);

  useEffect(() => {
    if (cursosDisponibles.length > 0 && materias.length > 0) {
      return;
    }

    const loadData = async () => {
      try {
        const [cursosRes, materiasRes] = await Promise.all([
          fetch(`${backurl}cursos`),
          fetch(`${backurl}materias`)
        ]);
        const cursosData = await cursosRes.json();
        const materiasData = await materiasRes.json();

        const opcionesCursos = cursosData.map((curso) => ({
          value: curso._id,
          label: curso.nombre,
        }));
        setCursosDisponibles(opcionesCursos);
        setMaterias(Array.isArray(materiasData) ? materiasData : []);
      } catch (error) {
        setError('Error al cargar datos iniciales');
      }
    };
    loadData();
  }, [backurl, cursosDisponibles.length, materias.length]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedCursos(selectedOptions || []);
  };

  const addHorario = () => {
    setHorarios([...horarios, { curso: '', diaSemana: '', horaInicio: '', horaFin: '' }]);
  };
  // Función para verificar si un horario es de recreo
  const esHorarioRecreo = (horaInicio, horaFin) => {
    const recreos = [
      { inicio: '09:30', fin: '09:45' },
      { inicio: '11:15', fin: '11:30' }
    ];
    return recreos.some(recreo => recreo.inicio === horaInicio && recreo.fin === horaFin);
  };

  const updateHorario = (index, field, value) => {
  const newHorarios = [...horarios];
  newHorarios[index][field] = value;
  setHorarios(newHorarios);

  // Verificar si el horario completo es de recreo (solo si se actualizó horaInicio o horaFin)
  if (field === 'horaInicio' || field === 'horaFin') {
    const horario = newHorarios[index];
    if (horario.horaInicio && horario.horaFin && esHorarioRecreo(horario.horaInicio, horario.horaFin)) {
      toast.warn('Has seleccionado un horario de recreo. ¿Estás seguro?', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
};

  const removeHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const validarHorarios = (horarios) => {
    for (let i = 0; i < horarios.length; i++) {
      for (let j = i + 1; j < horarios.length; j++) {
        const h1 = horarios[i];
        const h2 = horarios[j];
        if (h1.diaSemana === h2.diaSemana && h1.curso === h2.curso) {
          if ((h1.horaInicio < h2.horaFin && h1.horaFin > h2.horaInicio)) {
            return `Horarios solapados en ${h1.diaSemana} para el curso ${cursosDisponibles.find(c => c.value === h1.curso)?.label}`;
          }
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!nombreMateria || selectedCursos.length === 0) {
      setError('Por favor, ingrese el nombre de la materia y seleccione al menos un curso');
      setLoading(false);
      return;
    }

    const cursosToSend = selectedCursos.map((option) => option.value);
    const horariosToSend = horarios.filter(h => h.curso && h.diaSemana && h.horaInicio && h.horaFin);

    const errorHorarios = validarHorarios(horariosToSend);
    if (errorHorarios) {
      setError(errorHorarios);
      setLoading(false);
      return;
    }

    if (!editingMateria) {
      const materiaExistente = materias.find(
        (materia) => materia.nombreMateria.toLowerCase() === nombreMateria.toLowerCase()
      );
      if (materiaExistente) {
        setError('Ya existe una materia con ese nombre');
        setLoading(false);
        return;
      }
    }

    const url = editingMateria
      ? `${backurl}materias/${editingMateria._id}`
      : `${backurl}materias`;
    const method = editingMateria ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreMateria,
          cursos: cursosToSend,
          horarios: horariosToSend,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setSuccessMessage(editingMateria ? 'Materia modificada con éxito' : 'Materia creada con éxito');
        resetForm();
        const materiasRes = await fetch(`${backurl}materias`);
        const materiasData = await materiasRes.json();
        setMaterias(Array.isArray(materiasData) ? materiasData : []);
      } else {
        setError(data.message || 'Error al crear o modificar materia');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingMateria(null);
    setNombreMateria('');
    setSelectedCursos([]);
    setHorarios([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      try {
        const response = await fetch(`${backurl}materias/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.status === 'success') {
          setSuccessMessage('Materia eliminada con éxito');
          setMaterias((prevMaterias) => prevMaterias.filter((materia) => materia._id !== id));
        } else {
          setError(data.message || 'Error al eliminar la materia');
        }
      } catch (error) {
        setError('Error al conectar con el servidor');
      }
    }
  };

  const handleEditClick = (materia) => {
    setEditingMateria(materia);
    setNombreMateria(materia.nombreMateria);
    setSelectedCursos(
      materia.cursos.map((curso) => ({
        value: curso._id || curso,  // Si es objeto, usa _id; si string, usa el valor
        label: curso.nombre || curso,  // Si es objeto, usa nombre; si string, usa el valor
      }))
    );
    setHorarios(materia.horarios || []);
    // Scroll suave arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para formatear cursos y horarios
  const formatCursos = (cursos) => {
    if (!cursos || cursos.length === 0) return 'Sin cursos';
    return cursos.map(curso => curso.nombre || curso).join(', ');  // curso.nombre si es objeto, o el valor si es string
  };

  const formatHorarios = (horarios) => {
    if (!horarios || horarios.length === 0) return 'Sin horarios';
    const grouped = {};
    horarios.forEach(h => {
      const doc = h._doc || h;
      const cursoNombre = cursosDisponibles.find(c => c.value === doc.curso)?.label || doc.curso;
      if (!grouped[cursoNombre]) grouped[cursoNombre] = [];
      grouped[cursoNombre].push(`${doc.diaSemana} ${doc.horaInicio}-${doc.horaFin}`);
    });
    return Object.entries(grouped).map(([curso, hrs]) => `${curso}: ${hrs.join(', ')}`).join('; ');
  };

  return (
    <div className="crear-materia-container">
      <div className="form-section">
        <h2 className={`crear-materia-title ${editingMateria ? 'editing' : ''}`}>
          {editingMateria ? 'Editando Materia' : 'Crear Materia'}
        </h2>
        <form onSubmit={handleSubmit} className={`crear-materia-form ${editingMateria ? 'editing' : ''}`}>
          <input
            type="text"
            placeholder="Nombre de la Materia"
            value={nombreMateria}
            onChange={(e) => setNombreMateria(e.target.value)}
            className="input-nombre"
          />
          <div className="select-container">
            <h3 className="select-title">Seleccionar Cursos:</h3>
            <Select
              isMulti
              options={cursosDisponibles}
              value={selectedCursos}
              onChange={handleSelectChange}
              placeholder="Seleccionar cursos"
              className="select-cursos"
            />
          </div>

          <div className="horarios-container">
            <h3 className="horarios-title">Horarios (Opcional):</h3>
            {/* Header con etiquetas alineadas */}
            <div className="horario-header">
              <span>Seleccionar Curso</span>
              <span>Día</span>
              <span>Hora Inicio</span>
              <span>Hora Fin</span>
              <span>Acción</span>
            </div>
            {horarios.map((horario, index) => (
              <div key={index} className="horario-item">
                <select
                  value={horario.curso}
                  onChange={(e) => updateHorario(index, 'curso', e.target.value)}
                  className="select-curso-horario"
                >
                  <option value="">Seleccionar Curso</option>
                  {cursosDisponibles.map((curso) => (
                    <option key={curso.value} value={curso.value}>{curso.label}</option>
                  ))}
                </select>
                <select
                  value={horario.diaSemana}
                  onChange={(e) => updateHorario(index, 'diaSemana', e.target.value)}
                  className="select-dia"
                >
                  <option value="">Día</option>
                  <option value="lunes">Lunes</option>
                  <option value="martes">Martes</option>
                  <option value="miercoles">Miércoles</option>
                  <option value="jueves">Jueves</option>
                  <option value="viernes">Viernes</option>
                </select>
                <input
                  type="time"
                  placeholder="Hora Inicio"
                  value={horario.horaInicio}
                  onChange={(e) => updateHorario(index, 'horaInicio', e.target.value)}
                  className="input-hora"
                />
                <input
                  type="time"
                  placeholder="Hora Fin"
                  value={horario.horaFin}
                  onChange={(e) => updateHorario(index, 'horaFin', e.target.value)}
                  className="input-hora"
                />
                <button type="button" onClick={() => removeHorario(index)} className="btn-eliminar-horario">Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={addHorario} className="btn-agregar-horario">Agregar Horario</button>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {editingMateria ? 'Modificar Materia' : 'Crear Materia'}
          </button>

          {editingMateria && (
            <button
              type="button"
              onClick={resetForm}
              className="btn-cancelar"
            >
              Cancelar Edición
            </button>
          )}

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>

      <h3 className="lista-title">Materias Creadas</h3>
      <ul className="lista-materias">
        {Array.isArray(materias) &&
          materias.map((materia) => (
            <li key={materia._id} className="materia-item">
              <div className="materia-info">
                <p><strong>Nombre:</strong> {materia.nombreMateria}</p>
                <p><strong>Cursos:</strong> {formatCursos(materia.cursos)}</p>
                <p><strong>Horarios:</strong> {formatHorarios(materia.horarios)}</p>
              </div>
              <div className="materia-actions">
                <button onClick={() => handleEditClick(materia)} className="btn-editar">Editar</button>
                <button onClick={() => handleDelete(materia._id)} className="btn-eliminar">Eliminar</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CrearMateria;
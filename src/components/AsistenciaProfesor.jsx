import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "./AsistenciaProfesor.css";
 

const AsistenciaProfesor = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asistencia, setAsistencia] = useState({});
  const [fechasEscolares, setFechasEscolares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, role, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const generarFechas = () => {
      const fechas = [];
      const anioActual = 2026;
      const start = new Date(anioActual, 0, 1);
      const end = new Date(anioActual, 11, 31);
      let d = new Date(start);
      while (d <= end) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) {
          fechas.push(d.toISOString().split('T')[0]);
        }
        d.setDate(d.getDate() + 1);
      }
      setFechasEscolares(fechas);
    };
    generarFechas();
  }, []);

  useEffect(() => {
    const fetchCursosProfesor = async () => {
      if (userLoading) return;
      setLoading(true);
      try {
        if (!user || role !== 'profesor') {
          toast.error('Acceso denegado. Solo profesores pueden ver esta página.');
          navigate('/login');
          return;
        }
        const profesorId = user.id;
        const response = await axios.get(`http://localhost:3000/cursos/profeCursos?profesorId=${profesorId}`);
        setCursos(response.data || []);
      } catch (err) {
        setError('Error al cargar cursos del profesor');
        toast.error('Error al cargar cursos del profesor');
      } finally {
        setLoading(false);
      }
    };
    fetchCursosProfesor();
  }, [user, role, userLoading, navigate]);

  const alumnosDelCurso = cursoSeleccionado 
    ? cursos.find(c => c.nombre === cursoSeleccionado)?.alumnos || []
    : [];

  useEffect(() => {
    if (cursoSeleccionado && alumnosDelCurso.length > 0) {
      const cargarAsistencias = async () => {
        setLoading(true);
        try {
          const asistenciaInicial = {};
          await Promise.all(alumnosDelCurso.map(async (alumno) => {
            const response = await axios.get(`http://localhost:3000/alumnos/${alumno._id}`);
            const asistenciaAlumno = response.data.data?.asistencia || [];
            asistenciaInicial[alumno._id] = {};
            fechasEscolares.forEach(fecha => {
              const registro = asistenciaAlumno.find(a => a.fecha === fecha);
              asistenciaInicial[alumno._id][fecha] = registro ? registro.presente : null;
            });
          }));
          setAsistencia(asistenciaInicial);
        } catch (err) {
          console.error('Error en carga:', err);
          setError('Error al cargar asistencias');
          toast.error('Error al cargar asistencias');
        } finally {
          setLoading(false);
        }
      };
      cargarAsistencias();
    }
  }, [cursoSeleccionado, alumnosDelCurso, fechasEscolares]);

  // Toggle para hoy: alterna null -> true -> false -> null
  const toggleAsistenciaHoy = (alumnoId) => {
    setAsistencia(prev => {
      const estadoActual = prev[alumnoId]?.[hoy];
      let nuevoEstado;
      if (estadoActual === null || estadoActual === undefined) nuevoEstado = true; // Presente
      else if (estadoActual === true) nuevoEstado = false; // Ausente
      else nuevoEstado = null; // Gris
      return {
        ...prev,
        [alumnoId]: { ...prev[alumnoId], [hoy]: nuevoEstado }
      };
    });
  };

  // Guardar asistencia de hoy (requiere al menos un presente)
    const guardarAsistenciaHoy = async () => {
    // Verifica si hay al menos un presente marcado
    const hayPresentes = alumnosDelCurso.some(alumno => asistencia[alumno._id]?.[hoy] === true);
    if (!hayPresentes) {
        toast.error("Debes marcar al menos un alumno como presente para guardar.");
        return;
    }

    // Si hay presentes, guarda todos los marcados (presentes y ausentes de hoy)
    const hayMarcas = alumnosDelCurso.some(alumno => {
        const estado = asistencia[alumno._id]?.[hoy];
        return estado === true || estado === false;
    });

    if (!hayMarcas) {
        // Esto no debería pasar si hay presentes, pero por seguridad
        toast.error("No has marcado ninguna asistencia para hoy.");
        return;
    }

    setLoading(true);
    try {
        for (const alumno of alumnosDelCurso) {
        const estadoSeleccionado = asistencia[alumno._id]?.[hoy];
        if (estadoSeleccionado === null || estadoSeleccionado === undefined) continue; // Solo guarda marcados

        const res = await axios.get(`http://localhost:3000/alumnos/${alumno._id}`);
        let historial = res.data.data?.asistencia || [];
        historial = historial.filter(reg => reg.fecha !== hoy); // Elimina previos de hoy
        historial.push({ fecha: hoy, presente: estadoSeleccionado });

        await axios.put(`http://localhost:3000/alumnos/${alumno._id}`, { asistencia: historial });
        }
        toast.success(`Asistencia de hoy guardada.`);
    } catch (error) {
        console.error("Error al guardar:", error);
        toast.error("Error en el servidor al guardar asistencia.");
    } finally {
        setLoading(false);
    }
    };
  const contarFaltasEnPantalla = (alumnoId) => {
    return Object.values(asistencia[alumnoId] || {}).filter(val => val === false).length;
  };

  const mesesNom = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fechasPorMes = mesesNom.map((mes, index) => {
    const fechasDelMes = fechasEscolares.filter(fecha => {
      const d = new Date(fecha + "T00:00:00");
      return d.getMonth() === index;
    });
    return { mes, fechas: fechasDelMes };
  });

  const generarCeldasAsistencia = (alumno) => {
    let mesAnterior = null;
    return fechasEscolares.map(fecha => {
      const objFecha = new Date(fecha);
      const mesActual = objFecha.getMonth();
      const esInicioMes = mesActual !== mesAnterior;
      mesAnterior = mesActual;
      
      const estado = asistencia[alumno._id]?.[fecha];
      const claseColor = estado === true ? 'presente' : estado === false ? 'ausente' : 'gris';
      const esPrueba = mesActual < 2 ? 'mes-prueba' : '';

      const esClicable = fecha === hoy;

      return (
        <td key={fecha} className={`${esInicioMes ? 'inicio-mes-td' : ''} ${fecha === hoy ? 'hoy-col' : ''}`}>
          <div 
            className={`celda ${claseColor} ${esPrueba}`} 
            onClick={esClicable ? () => toggleAsistenciaHoy(alumno._id) : undefined}
            style={{ cursor: esClicable ? 'pointer' : 'default' }}
          ></div>
        </td>
      );
    });
  };

  if (loading && cursos.length === 0) return <div className="loading">Cargando...</div>;

  return (
    <div className="asistencia-container">
      <ToastContainer />
      <h2>Vista de Asistencias - Profesor</h2>
      <div className="cursos-grid">
        {cursos.map(curso => (
          <button key={curso.nombre} onClick={() => setCursoSeleccionado(curso.nombre)} className="curso-btn">
            {curso.nombre}
          </button>
        ))}
      </div>

      {cursoSeleccionado && (
        <div className="curso-detalle">
          <h3>Asistencias De {cursoSeleccionado} (Ciclo 2026)</h3>
          <h4>Un clic para presente, doble clic para ausente (solo para hoy)</h4>
          <h5>Presentes ✅ <span style={{ marginLeft: '40px' }}> Ausentes 🟥</span></h5>
          {alumnosDelCurso.length === 0 ? (
            <p className="sinAlumnos">No hay alumnos en este curso.</p>
          ) : (
            <>
              <div className="tabla-asistencia-container">
                <table className="tabla-asistencia">
                  <thead>
                    <tr>
                      <th className="alumno-sticky-header" style={{ minWidth: '200px' }}>Mes</th> 
                      {fechasPorMes.map(mesData => (
                        mesData.fechas.length > 0 ? (
                          <th key={mesData.mes} colSpan={mesData.fechas.length} className="titulo-mes" style={{ textAlign: 'center', borderLeft: '2px solid #fff' }}>
                            {mesData.mes}
                          </th>
                        ) : null
                      ))}
                    </tr>
                    <tr>
                      <th className="alumno-sticky-header" style={{ minWidth: '200px' }}>Alumnos</th>
                      {fechasEscolares.map((fecha, idx) => {
                        const d = new Date(fecha + "T00:00:00");
                        const mesActual = d.getMonth();
                        const mesAnterior = idx > 0 ? new Date(fechasEscolares[idx-1] + "T00:00:00").getMonth() : null;
                        const esInicio = mesActual !== mesAnterior;
                        return (
                          <th key={fecha} className={`${esInicio ? 'inicio-mes-header' : ''} ${fecha === hoy ? 'hoy-header' : ''}`}>
                            {d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {alumnosDelCurso.map(alumno => {
                      const faltas = contarFaltasEnPantalla(alumno._id);
                      const estaLibre = faltas >= 28;
                      return (
                        <tr key={alumno._id} className={estaLibre ? "fila-libre" : ""}>
                          <td className="alumno-fijo-celda">
                            <div className="alumno-flex">
                              <span style={{ color: estaLibre ? 'red' : 'inherit', fontWeight: estaLibre ? 'bold' : 'normal' }}>
                                {alumno.apellido}, {alumno.nombre} 
                                {estaLibre && <strong style={{color: 'black', marginLeft: '5px'}}>[LIBRE]</strong>}
                              </span>
                              {estaLibre && <span title="Alumno fuera de sistema por faltas">🚫</span>}
                            </div>
                          </td>
                          {generarCeldasAsistencia(alumno)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button onClick={guardarAsistenciaHoy} className="guardar-btn">Guardar Asistencia de Hoy</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AsistenciaProfesor;
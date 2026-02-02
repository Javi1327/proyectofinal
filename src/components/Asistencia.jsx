import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Asistencia.css";

const Asistencia = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asistencia, setAsistencia] = useState({}); 
  const [fechasEscolares, setFechasEscolares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalNotif, setModalNotif] = useState({ show: false, alumno: null, mensaje: "" });
  const [fechaDeCarga, setFechaDeCarga] = useState(new Date().toISOString().split('T')[0]);
  const [mostrarEditor, setMostrarEditor] = useState(false); // Nuevo estado para mostrar/ocultar el editor de fechas

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const generarFechas = () => {
      const fechas = [];
      // Usamos 2026 para que coincida con tu ciclo actual
      const anioActual = 2026; 
      const start = new Date(anioActual, 0, 1); // 1 de Enero
      const end = new Date(anioActual, 11, 31); // 31 de Diciembre

      let d = new Date(start);
      while (d <= end) {
        const day = d.getDay();
        // Solo Lunes a Viernes
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
    const fetchCursos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/cursos');
        setCursos(response.data || []);
      } catch (err) {
        setError('Error al cargar cursos');
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

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
        } finally {
          setLoading(false);
        }
      };
      cargarAsistencias();
    }
  }, [cursoSeleccionado, alumnosDelCurso, fechasEscolares]);

  const toggleAsistencia = (alumnoId, fecha) => {
    // Nota: El comentario indica que originalmente había una restricción para editar solo la fecha de carga,
    // pero está comentado. Si quieres reactivarlo, descoméntalo.
    // if (fecha !== fechaDeCarga) {
    //   toast.warning(`Para editar esta fecha, selecciónala la fecha deseada`);
    //   return;
    // }

    setAsistencia(prev => {
      const estadoActual = prev[alumnoId]?.[fecha];
      let nuevoEstado;
      if (estadoActual === null || estadoActual === undefined) nuevoEstado = true;
      else if (estadoActual === true) nuevoEstado = false;
      else nuevoEstado = null;

      return {
        ...prev,
        [alumnoId]: { ...prev[alumnoId], [fecha]: nuevoEstado }
      };
    });
  };

  const guardarAsistencia = async () => {
    // 1. Verificar si hay AL MENOS un cambio realizado en la columna actual
    const hayMarcas = alumnosDelCurso.some(alumno => {
      const estado = asistencia[alumno._id]?.[fechaDeCarga];
      return estado === true || estado === false;
    });

    // Si no hay nada marcado (todo gris), mostramos error y detenemos el proceso
    if (!hayMarcas) {
      toast.error("❌ No has marcado ninguna asistencia (todos están en gris). Selecciona Presente o Ausente antes de guardar.");
      return;
    }

    // 2. Si hay marcas, procedemos a contar cuántos quedan en gris para avisar
    const alumnosEnGris = alumnosDelCurso.filter(alumno => {
      const estado = asistencia[alumno._id]?.[fechaDeCarga];
      return estado === null || estado === undefined;
    });

    if (alumnosEnGris.length > 0) {
      toast.info(`ℹ️ Guardando asistencia. Hay ${alumnosEnGris.length} alumnos que quedarán sin registro.`);
    }
    setLoading(true);

    try {
      // Usamos for...of para procesar uno por uno y evitar duplicados
      for (const alumno of alumnosDelCurso) {
        const estadoSeleccionado = asistencia[alumno._id]?.[fechaDeCarga];

        // Si no hay selección (Gris), saltamos al siguiente
        if (estadoSeleccionado === null || estadoSeleccionado === undefined) continue;

        // 1. Obtenemos los datos frescos del alumno
        const res = await axios.get(`http://localhost:3000/alumnos/${alumno._id}`);
        let historial = res.data.data?.asistencia || res.data.asistencia || [];

        // 2. FILTRADO AGRESIVO: Eliminamos CUALQUIER registro que coincida con la fecha de carga.
        historial = historial.filter(reg => {
          if (!reg.fecha) return false;
          const fechaRegCorta = reg.fecha.split('T')[0];
          return fechaRegCorta !== fechaDeCarga;
        });

        // 3. Insertamos EL ÚNICO registro nuevo
        historial.push({ 
          fecha: fechaDeCarga, 
          presente: estadoSeleccionado 
        });

        // 4. Guardamos y ESPERAMOS antes de seguir con el siguiente alumno
        await axios.put(`http://localhost:3000/alumnos/${alumno._id}`, { 
          asistencia: historial 
        });
      }

      toast.success(`✅ Asistencia del ${fechaDeCarga} sincronizada y limpia.`);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error en el servidor al procesar la lista.");
    } finally {
      setLoading(false);
    }
  };

  const contarFaltasEnPantalla = (alumnoId) => {
    return Object.values(asistencia[alumnoId] || {}).filter(val => val === false).length;
  };

  const abrirModalNotif = (alumno) => {
    const faltas = contarFaltasEnPantalla(alumno._id);
    const mensajePre = `Estimado padre de ${alumno.nombre} ${alumno.apellido}, su hijo registra ${faltas} inasistencias porfavor comuniquese con la escuela.`;
    setModalNotif({ show: true, alumno, mensaje: mensajePre });
  };

  const enviarNotif = () => {
    toast.info(`Simulando envío a: ${modalNotif.alumno.correoPadre || 'Padre'}`);
    setModalNotif({ show: false, alumno: null, mensaje: "" });
  };

  // Agregamos Enero y Febrero a la lista
  const mesesNom = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fechasPorMes = mesesNom.map((mes, index) => {
    // Filtramos las fechas que pertenecen a este mes real
    const fechasDelMes = fechasEscolares.filter(fecha => {
      // Usamos T00:00:00 para que la fecha sea exacta a las 0 horas de ese día
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

      // Detectamos si es Enero o Febrero para el color del CSS
      const esPrueba = mesActual < 2 ? 'mes-prueba' : '';

      return (
        <td key={fecha} className={`${esInicioMes ? 'inicio-mes-td' : ''} ${fecha === hoy ? 'hoy-col' : ''}`}>
          <div className={`celda ${claseColor} ${esPrueba}`} onClick={() => toggleAsistencia(alumno._id, fecha)}></div>
        </td>
      );
    });
  };

  if (loading && cursos.length === 0) return <div className="loading">Cargando...</div>;

  return (
    <div className="asistencia-container">
      <ToastContainer />
      <h2>Gestión de Asistencias</h2>
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
          <h4>un clic para presente y doble clic para ausente</h4>
          <h5>Presentes ✅ <span style={{ marginLeft: '40px' }}> Ausentes🟥</span></h5>
          {alumnosDelCurso.length === 0 ? (
            <p className="sinAlumnos">⚠️ Este curso no tiene alumnos.</p>
          ) : (
            <>
              <div className="tabla-asistencia-container">
                <table className="tabla-asistencia">
                  <thead>
                    <tr>
                      {/* Esta celda debe ser igual de ancha que la de los nombres de alumnos */}
                      <th className="alumno-sticky-header" style={{ minWidth: '200px' }}>Mes</th> 
                      {fechasPorMes.map(mesData => (
                        // Solo mostramos el mes si tiene días (esto evita columnas vacías)
                        mesData.fechas.length > 0 ? (
                          <th 
                            key={mesData.mes} 
                            colSpan={mesData.fechas.length} 
                            className="titulo-mes"
                            style={{ textAlign: 'center', borderLeft: '2px solid #fff' }}
                          >
                            {mesData.mes}
                          </th>
                        ) : null
                      ))}
                    </tr>
                    <tr>
                      <th className="alumno-sticky-header" style={{ minWidth: '200px' }}>Alumnos</th>
                      {fechasEscolares.map((fecha, idx) => {
                        // Usamos la misma lógica de T00:00:00 aquí también
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
                              {!estaLibre && faltas >= 20 && (
                                <button onClick={() => abrirModalNotif(alumno)} className="alerta-btn" title="Riesgo de Libre">🔔</button>
                              )}
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
              <button onClick={guardarAsistencia} className="guardar-btn">Guardar Solo Hoy</button>

              <div className="panel-control-asistencia">
                <button onClick={() => setMostrarEditor(!mostrarEditor)} className="editar-btn">
                  {mostrarEditor ? 'Ocultar Editor de Fechas' : 'Editar Fechas'}
                </button>
                {mostrarEditor && (
                  <>
                    <div className="selector-fecha">
                      <label>📅 Seleccione la fecha a editar: </label>
                      <input 
                        type="date" 
                        value={fechaDeCarga} 
                        onChange={(e) => setFechaDeCarga(e.target.value)}
                        className="input-fecha-carga"
                      />
                    </div>
                    <button onClick={guardarAsistencia} className="guardar-btn">
                      Guardar Cambios del día {fechaDeCarga}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {modalNotif.show && (
        <div className="modal">
          <div className="modal-content">
            <h4>Notificar a Padres de {modalNotif.alumno?.nombre}</h4>
            <textarea value={modalNotif.mensaje} onChange={(e) => setModalNotif(p => ({ ...p, mensaje: e.target.value }))} rows="4" />
            <div style={{marginTop: '10px'}}>
              <button onClick={enviarNotif} className="guardar-btn" style={{background: 'green'}}>Enviar</button>
              <button onClick={() => setModalNotif({ show: false })} className="guardar-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asistencia;
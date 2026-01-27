import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import "./VerAsistenciasAlumno.css";

const VerAsistenciasAlumno = () => {
  const { user, role } = useUser();
  const navigate = useNavigate();
  const backurl = import.meta.env.VITE_URL_BACK;

  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Por defecto, mostramos el mes actual (o Marzo si es muy temprano)
  const mesActualIndex = new Date().getMonth();
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActualIndex);

  const LIMITE_FALTAS = 28;

  useEffect(() => {
    if (role !== 'alumno') {
      navigate('/');
      return;
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${backurl}alumnos/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const asistenciaRaw = data.data?.asistencia || [];
        setAsistencias(asistenciaRaw);
      } catch (error) {
        setError("No se pudieron cargar las asistencias.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchAsistencias();
  }, [user?.id, backurl]);

  // Cálculos de estado
  const { faltasTotales, faltasRestantes, estadoCondicion, colorEstado } = useMemo(() => {
    const faltas = asistencias.filter(a => a.presente === false).length;
    const restantes = LIMITE_FALTAS - faltas;
    
    let estado = "Regular";
    let color = "#28a745"; // Verde

    if (faltas >= 28) {
      estado = "Libre";
      color = "#000000";
    } else if (faltas >= 20) {
      estado = "Riesgo Crítico";
      color = "#dc3545"; // Rojo
    } else if (faltas >= 12) {
      estado = "En Alerta";
      color = "#ffc107"; // Amarillo
    }

    return { 
      faltasTotales: faltas, 
      faltasRestantes: restantes > 0 ? restantes : 0, 
      estadoCondicion: estado,
      colorEstado: color 
    };
  }, [asistencias]);

  // Nombres de meses para el selector
  const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Generar días del mes para el calendario de 2026
  const generarCalendario2026 = () => {
    const año = 2026;
    // Obtenemos el primer día y cantidad de días del mes seleccionado
    const primerDiaMes = new Date(año, mesSeleccionado, 1).getDay(); 
    const diasEnMes = new Date(año, mesSeleccionado + 1, 0).getDate();

    const celdas = [];
    
    // Espacios vacíos antes del primer día (Ajuste para Lunes como primer día)
    const offset = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
    for (let i = 0; i < offset; i++) {
      celdas.push(<div key={`emp-${i}`} className="dia vacio"></div>);
    }

    // Bucle de días
    // Días del mes
    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const mesFormateado = (mesSeleccionado + 1).toString().padStart(2, '0');
      const diaFormateado = dia.toString().padStart(2, '0');
      const fechaCalendario = `2026-${mesFormateado}-${diaFormateado}`;

      const registro = asistencias.find(a => a.fecha.split('T')[0] === fechaCalendario);

      let claseAsistencia = "dia sin-registro";
      let textoEstado = "";

      // CAMBIO CLAVE: Verificación estricta de booleanos
      if (registro !== undefined && registro !== null) {
        if (registro.presente === true) {
          claseAsistencia = "dia presente";
          textoEstado = "P";
        } else if (registro.presente === false) {
          claseAsistencia = "dia ausente"; // Ahora sí entrará aquí
          textoEstado = "A";
        }
      }

      celdas.push(
        <div key={dia} className={`${claseAsistencia}`}>
          <span className="num-dia">{dia}</span>
          {textoEstado && <span className="label-estado">{textoEstado}</span>}
        </div>
      );
    }
    return celdas;
  };

  return (
    <div className="ver-asistencias-container">
      <header className="asistencia-header">
        <button onClick={() => navigate('/alumno/home')} className="volver-btn">← Panel</button>
        <h2>Mi Reporte de Asistencia 2026</h2>
      </header>
      
      <div className="dashboard-alumno">
        {/* Card de Estado Crítico */}
        <div className="resumen-card">
          <div className="info-principal">
            <div className="circulo-porcentaje">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#eee" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={colorEstado} strokeWidth="10" 
                  strokeDasharray={`${(faltasTotales / LIMITE_FALTAS) * 314} 314`}
                  transform="rotate(-90 60 60)" strokeLinecap="round"
                />
              </svg>
              <div className="texto-central">
                <span className="numero">{faltasTotales}</span>
                <span className="sub">Faltas</span>
              </div>
            </div>
            
            <div className="detalles-condicion">
              <p>Situación actual:</p>
              <h3 style={{ color: colorEstado }}>{estadoCondicion}</h3>
              <div className="alert-box" style={{ borderColor: colorEstado }}>
                {faltasTotales >= LIMITE_FALTAS 
                  ? "Has superado el límite de 28 faltas." 
                  : `Te quedan ${faltasRestantes} faltas disponibles en el año.`}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Calendario */}
        <div className="calendario-seccion">
          <div className="calendario-header">
            <h3>Inasistencias por Mes</h3>
            <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(parseInt(e.target.value))} className="mes-select">
              {mesesNombres.map((mes, i) => (
                <option key={i} value={i}>{mes}</option> // De Marzo en adelante
              ))}
            </select>
          </div>

          <div className="semana-labels">
            <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
          </div>
          <div className="calendario-grid">
            {generarCalendario2026()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerAsistenciasAlumno;
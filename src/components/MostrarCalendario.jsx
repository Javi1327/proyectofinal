import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import './MostrarCalendario.css';

const MostrarCalendario = () => {
  const { user, role } = useUser();
  const navigate = useNavigate();
  const backurl = import.meta.env.VITE_URL_BACK;

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cursoId, setCursoId] = useState(user?.cursoId || null);

  // Función para normalizar horas (e.g., "8:00" -> "08:00")
  const normalizarHora = (hora) => {
    if (!hora || typeof hora !== 'string') return '';
    const [hh, mm] = hora.split(':');
    return hh && mm ? `${hh.padStart(2, '0')}:${mm}` : '';
  };

  // Función para normalizar días (asegura lowercase y sin acentos)
  const normalizarDia = (dia) => {
    if (!dia || typeof dia !== 'string') return '';
    return dia.toLowerCase().replace('é', 'e'); // e.g., "miércoles" -> "miercoles"
  };

  // Protección: Solo alumnos pueden acceder
  useEffect(() => {
    if (role !== 'alumno') {
      navigate('/');
      return;
    }
  }, [role, navigate]);

  // Un solo useEffect para manejar ambos fetches
  useEffect(() => {
    // Evitar fetch si ya tenemos cursoId y horarios cargados
    if (cursoId && horarios.length > 0) {
      return; // Ya tenemos datos, no fetch
    }

    const fetchData = async () => {
      // Primero, obtener cursoId si no existe
      let currentCursoId = cursoId;
      if (!currentCursoId && user?.id) {
        try {
          const response = await fetch(`${backurl}alumnos/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          const alumnoData = await response.json();
          currentCursoId = alumnoData.data.grado._id;
          setCursoId(currentCursoId);
        } catch (err) {
          setError('No se pudo obtener el curso del alumno.');
          return;
        }
      }

      // Si tenemos cursoId, obtener horarios
      if (currentCursoId && role === 'alumno') {
        setLoading(true);
        setError("");
        try {
          const response = await fetch(`${backurl}materias?cursoId=${currentCursoId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
          }
          const materiasData = await response.json();

          // Aplanar los horarios con validaciones robustas
          const horariosAplanados = [];
          if (Array.isArray(materiasData)) {
            materiasData.forEach((materia) => {
              if (materia.horarios && Array.isArray(materia.horarios) && materia.horarios.length > 0) {
                materia.horarios.forEach((h) => {
                  if (h && typeof h === 'object' && h._doc) {
                    const doc = h._doc;
                    const diaNormalizado = normalizarDia(doc.diaSemana);
                    const horaInicioNormalizada = normalizarHora(doc.horaInicio);
                    const horaFinNormalizada = normalizarHora(doc.horaFin);
                    const horarioNormalizado = `${horaInicioNormalizada} - ${horaFinNormalizada}`;
                    if (diaNormalizado && horaInicioNormalizada && horaFinNormalizada) {
                      horariosAplanados.push({
                        dia: diaNormalizado,
                        horario: horarioNormalizado,
                        materia: materia.nombreMateria,
                        profesor: h.profesor || 'Prof Sin asignar',
                      });
                    }
                  }
                });
              }
            });
          }
          setHorarios(horariosAplanados);
        } catch (error) {
          setError(`No se pudieron cargar los horarios: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.id, cursoId, role, backurl]);

  // Verifica si user.id y cursoId están disponibles
  if (!user?.id || !cursoId) {
    return <p>Error: No se ha encontrado el ID del alumno o el curso. Por favor, inicie sesión nuevamente.</p>;
  }

  // Función para renderizar la tabla del calendario
  const renderCalendario = () => {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const diasCapitalizados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const bloquesHorarios = [
      { tiempo: '08:00 - 09:30', esRecreo: false },
      { tiempo: '09:30 - 09:45', esRecreo: true },
      { tiempo: '09:45 - 11:15', esRecreo: false },
      { tiempo: '11:15 - 11:30', esRecreo: true },
      { tiempo: '11:30 - 13:00', esRecreo: false },
    ];

    return (
      <table className="calendario-table">
        <thead>
          <tr>
            <th>Horario</th>
            {diasCapitalizados.map((dia) => <th key={dia}>{dia}</th>)}
          </tr>
        </thead>
        <tbody>
          {bloquesHorarios.map((bloque, index) => (
            <tr key={index}>
              <td>{bloque.tiempo}</td>
              {dias.map((dia) => {
                const horariosDia = horarios.filter((h) => h.dia === dia && h.horario === bloque.tiempo);
                return (
                  <td key={dia}>
                    {bloque.esRecreo ? 'Recreo' : (
                      horariosDia.length > 0 
                        ? horariosDia.map((h) => `${h.materia} - ${h.profesor}`).join(', ')
                        : 'N/A'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="calendario-container">
      <h2>Calendario Académico de Mi Curso</h2>
      <button onClick={() => navigate('/alumno/home')} className="volver-btn">Volver al Panel</button>
      {loading && <p>Cargando calendario...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && horarios.length === 0 && <p style={{ color: "orange" }}>No hay materias asignadas para este curso aún. Contacta a tu profesor.</p>}
      {!loading && !error && renderCalendario()}
    </div>
  );
};

export default MostrarCalendario;
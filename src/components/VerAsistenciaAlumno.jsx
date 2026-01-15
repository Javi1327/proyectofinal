import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Agrega para navegación y protección
import { useUser } from '../context/UserContext';

const VerAsistenciasAlumno = () => {
  const { user, role } = useUser();  // Cambia alumnoId a user.id
  const navigate = useNavigate();  // Agrega para protección
  const backurl = import.meta.env.VITE_URL_BACK;

  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtroMes, setFiltroMes] = useState(''); // Filtro opcional por mes

  // Protección: Solo alumnos pueden acceder
  useEffect(() => {
    if (role !== 'alumno') {
      navigate('/');
      return;
    }
  }, [role, navigate]);

  // Verifica si user.id está disponible
  if (!user?.id) {
    return <p>Error: No se ha encontrado el ID del alumno. Por favor, inicie sesión nuevamente.</p>;
  }

  // useEffect para obtener asistencias
  useEffect(() => {
    const fetchAsistencias = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${backurl}alumnos/${user.id}`, {  // Cambia alumnoId a user.id
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,  // Agrega token JWT
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data); // Para depuración
        // Accede a 'asistencia' dentro de 'data.data' (según el esquema)
        const asistenciaRaw = data.data?.asistencia || [];
        // Convierte el array: { fecha: Date, presente: Boolean } -> { fecha: string, estado: string }
        const asistenciaFormateada = asistenciaRaw.map(item => ({
          fecha: new Date(item.fecha).toISOString().split('T')[0], // Formatea a YYYY-MM-DD
          estado: item.presente ? 'Presente' : 'Ausente'
        }));
        setAsistencias(asistenciaFormateada);
      } catch (error) {
        console.error("Error al obtener asistencias:", error);
        setError(`No se pudieron cargar las asistencias: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, [user.id, backurl]);  // Cambia alumnoId a user.id

  // Filtrar asistencias por mes (opcional)
  const asistenciasFiltradas = filtroMes
    ? asistencias.filter(a => a.fecha.startsWith(filtroMes))
    : asistencias;

  return (
    <div className="ver-asistencias-container">
      <h2>Mis Asistencias</h2>
      <button onClick={() => navigate('/alumno/home')} className="volver-btn">Volver al Panel</button>  // Agrega botón volver
      {loading && <p>Cargando asistencias...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {/* Filtro opcional */}
      <label>
        Filtrar por mes (YYYY-MM):
        <input
          type="text"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          placeholder="Ej: 2023-10"
        />
      </label>
      
      <table className="asistencias-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistenciasFiltradas.length > 0 ? (
            asistenciasFiltradas.map((asistencia, index) => (
              <tr key={index}>
                <td>{asistencia.fecha}</td>
                <td className={asistencia.estado === 'Presente' ? 'presente' : 'ausente'}>
                  {asistencia.estado}
                </td>
              </tr>
            ))
          ) : (
            !loading && <tr><td colSpan="2">No hay asistencias disponibles.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerAsistenciasAlumno;
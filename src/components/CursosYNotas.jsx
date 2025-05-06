import { useEffect, useState } from "react";
import axios from "axios";

const CursosYNotas = () => {
    const [cursos, setCursos] = useState([]);
    const [alumnosDelCurso, setAlumnosDelCurso] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

    // Profesor de prueba (luego usar ID del usuario logueado)
    const profesorId = "680827fbd168a4b28ef24198";

    useEffect(() => {
        const obtenerCursos = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/cursos/profesor/${profesorId}`);
                setCursos(res.data);
            } catch (error) {
                console.error("Error al obtener cursos:", error);
            }
        };

        obtenerCursos();
    }, []);

    const verAlumnosDelCurso = async (curso) => {
        try {
            const res = await axios.get(`http://localhost:3000/cursos/${curso._id}/alumnos`);
            setAlumnosDelCurso(res.data);
            setCursoSeleccionado(curso);
            setModalAbierto(true);
        } catch (error) {
            console.error("Error al obtener alumnos:", error);
        }
    };

    return (
        <div>
            <h2>Cursos asignados</h2>
            {cursos.length === 0 ? (
                <p>No tenés cursos asignados.</p>
            ) : (
                <ul>
                    {cursos.map((curso) => (
                        <li key={curso._id}>
                            <button onClick={() => verAlumnosDelCurso(curso)}>
                                {curso.nombre}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal de alumnos */}
            {modalAbierto && (
                <div className="modal">
                    <h3>Alumnos de {cursoSeleccionado.nombre}</h3>
                    <ul>
                        {alumnosDelCurso.map((alumno) => (
                            <li key={alumno._id}>
                                <strong>{alumno.apellido}, {alumno.nombre}</strong>
                                <ul>
                                    {alumno.materiasAlumno.map((materiaObj, idx) => (
                                        <li key={idx}>
                                            {materiaObj.materia?.nombre}: 
                                            N1: {materiaObj.nota1}, 
                                            N2: {materiaObj.nota2}, 
                                            Prom: {materiaObj.promedio}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setModalAbierto(false)}>Cerrar</button>
                </div>
            )}
        </div>
    );
};

export default CursosYNotas;

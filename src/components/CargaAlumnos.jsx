// App.js
import React, { useState } from 'react';
import axios from 'axios';  // Importamos axios para manejar las solicitudes HTTP
import './CargaAlumnos.css';

function Alumno() {
    const [Nombre, setNombre] = useState("");
    const [Apellido, setApellido] = useState("");
    const [Correo, setCorreo] = useState("");
    const [Dni, setDni] = useState("");
    const [Telefono, setTelefono] = useState("");
    const [Direccion, setDireccion] = useState("");
    const [FechaNacimiento, setFechaNacimiento] = useState("");
    const [Grado, setGrado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!Nombre || !Apellido || !Correo || !Dni) {
            setError(true);
            setMensaje("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const nuevoAlumno = {
            Nombre,
            Apellido,
            Correo,
            Dni,
            Telefono,
            Direccion,
            FechaNacimiento,
            Grado,
            isHabilitado: true // Añadimos este campo para el estado del alumno
        };

        try {
            // Hacemos la solicitud POST a la API
            await axios.post('http://localhost:3001/alumnos', nuevoAlumno);
            setError(false);
            setMensaje("Alumno cargado exitosamente!");

            // Limpiar los campos después de enviar
            setNombre("");
            setApellido("");
            setCorreo("");
            setDni("");
            setTelefono("");
            setDireccion("");
            setFechaNacimiento("");
            setGrado("");
        } catch (err) {
            console.error("Error al enviar los datos:", err);
            setError(true);
            setMensaje("Hubo un error al cargar el alumno. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="container">
            <h2 className='tituloForm'>Formulario de Alumno</h2>

            {mensaje && (
                <div className={error ? 'mensaje-error' : 'mensaje-exito'}>
                    {mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" value={Nombre} onChange={(e) => setNombre(e.target.value)} required maxLength="30"/>
                </label>

                <label>
                    Apellido:
                    <input type="text" value={Apellido} onChange={(e) => setApellido(e.target.value)} required maxLength="30"/>
                </label>

                <label>
                    Correo:
                    <input type="email" value={Correo} onChange={(e) => setCorreo(e.target.value)} required maxLength="30"/>
                </label>

                <label>
                    DNI:
                    <input type="text" value={Dni} onChange={(e) => setDni(e.target.value)} required maxLength="10" pattern="\d*"/>
               </label>

                <label>
                    Teléfono:
                    <input type="tel" value={Telefono} onChange={(e) => setTelefono(e.target.value)} required maxLength="15" pattern="\d*" />
                </label>

                <label>
                    Dirección:
                    <input type="text" value={Direccion} onChange={(e) => setDireccion(e.target.value)} required maxLength="30" />
                </label>

                <label>
                    Fecha de Nacimiento:
                    <input type="date" value={FechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                </label>

                <label>
                    Grado:
                    <input type="text" value={Grado} onChange={(e) => setGrado(e.target.value)} required maxLength="5"/>
                </label>

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Alumno;

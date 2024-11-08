// App.js
import React, { useState } from 'react';
import './CargaAlumnos.css';

function Alumno() {
    const [Nombre, setNombre] = useState("");
    const [Apellido, setApellido] = useState("");
    const [Correo, setCorreo] = useState("");
    const [Telefono, setTelefono] = useState("");
    const [Direccion, setDireccion] = useState("");
    const [FechaNacimiento, setFechaNacimiento] = useState("");
    const [Genero, setGenero] = useState("");
    const [Grado, setGrado] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Muestra los datos en la consola (puedes cambiarlo para enviarlos a un backend, por ejemplo)
        console.log({
            Nombre,
            Apellido,
            Correo,
            Telefono,
            Direccion,
            FechaNacimiento,
            Genero,
            Grado
        });
    };

    return (
        <div className="contenedorFormulario">
            <h2 className='tituloForm'>Formulario de Alumno</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        value={Nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Apellido:
                    <input
                        type="text"
                        value={Apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Correo:
                    <input
                        type="email"
                        value={Correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Teléfono:
                    <input
                        type="tel"
                        value={Telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Dirección:
                    <input
                        type="text"
                        value={Direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Fecha de Nacimiento:
                    <input
                        type="date"
                        value={FechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Género:
                    <select
                        value={Genero}
                        onChange={(e) => setGenero(e.target.value)}
                        required
                    >
                        <option value="">Selecciona</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </label>
                <br /><br />
                <label>
                    Grado:
                    <input
                        type="text"
                        value={Grado}
                        onChange={(e) => setGrado(e.target.value)}
                        required
                    />
                </label>
                <br /><br />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Alumno;

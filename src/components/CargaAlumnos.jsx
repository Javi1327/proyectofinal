// App.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
//import axios from 'axios';  // Importamos axios para manejar las solicitudes HTTP
import './CargaAlumnos.css';

function Alumno() {
    const navigate = useNavigate();

    const backurl = import.meta.env.VITE_URL_BACK;

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
            nombre: Nombre,
            apellido: Apellido,
            correoElectronico: Correo,
            dni: Dni,
            telefono: Telefono,
            direccion: Direccion,
            fechaNacimiento: FechaNacimiento,
            grado: Grado,
            //isHabilitado: true // Añadimos este campo para el estado del alumno
        };

        try {
            let respuesta = await fetchback(nuevoAlumno);
            if (respuesta === -1) {
                respuesta = await fetchback(nuevoAlumno);
            }
    
            if (respuesta) {
                alert("Alumno creado");
                navigate("/preceptor");
            } else {
                alert("Alumno no creado");
            }
        } catch (err) {
            console.error("Error al enviar los datos:", err);
            setError(true);
            setMensaje("Hubo un error al cargar el alumno. Inténtalo de nuevo.");
        }
    };

    const fetchback = async (nuevoAlumno) => {
        const response = await fetch(`${backurl}alumnos/`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
           // "Authorization":accessToken
          },
          body: JSON.stringify(nuevoAlumno),
        }); // metodo body headers 
        /*if(response.status === 401){
          const res = await handleRefreshToken();
          if(res === -1){
            navigate("/login");
          }
          
        }*/
        const responsejson = await response.json();
        console.log(responsejson.data);
        console.log("Respuesta del servidor:", responsejson);
        if (response.ok) {
          return responsejson.data
        }else{
          return null
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
                    <input type="date" value={FechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required  max={new Date().toISOString().split("T")[0]} />
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

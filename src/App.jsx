import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import CargaAlumnos from './components/CargaAlumnos';
import Footer from './Pages/Home/Footer';
import { UserProvider } from './context/UserContext'; // Corregida la ruta (elimina 'src')
import ProfesorView from './pages/ProfesorView';
import SubirNotas from './components/SubirNotas';
import './App.css';
import Navbar from './components/Navbar';
import VerCursos from './components/VerCursos';
import PreceptorView from './pages/PreceptorView';
import Alumno from './components/CargaAlumnos';
import VerAlumnos from './components/VerAlumnos';
import Asistencia from './components/Asistencia';
import VerNotas from './components/VerNotas';
import AlumnoView from './pages/AlumnoView';
import VerNotasAlumnos from './components/VerNotasAlumnos';
import TareasAlumno from './components/TareasAlumno';
import TareasProfesor from './components/TareasProfesor';
import Foro from './components/Foro';
import AdminView from './Pages/AdminView';
import CrearMaterias from './components/CrearMaterias';
import CrearUsuario from './components/CrearUSUario';
import AsignarCursos from './components/AsignarCursos';
import VerUsuarios from './components/VerUsuarios';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/carga-alumnos" element={<CargaAlumnos />} />
          <Route path="/profesor" element={<ProfesorView />} />
          <Route path="/profesor/subir-notas" element={<SubirNotas />} />
          <Route path="/profesor/ver-cursos" element={<VerCursos />} />
          <Route path="/profesor/ver-notas" element={<VerNotas />} />
          <Route path="/profesor/tareas-profesor" element={<TareasProfesor />} />
          <Route path="/preceptor" element={<PreceptorView />} />
          <Route path="/preceptor/cargar-alumnos" element={<Alumno />} />
          <Route path="/preceptor/ver-alumnos" element={<VerAlumnos />} />
          <Route path="/preceptor/ver-cursos" element={<VerCursos />} />
          <Route path='/preceptor/Dar-asistencias' element={<Asistencia />} />
          <Route path="/alumno" element={<AlumnoView />} />
          <Route path="/alumno/ver-notas" element={<VerNotasAlumnos />} />
          <Route path="/alumno/tareas-alumno" element={<TareasAlumno />} />
          <Route path="/alumno/foro" element={<Foro />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/admin/crear-usuario" element={<CrearUsuario />} />
          <Route path='/admin/ver-usuarios' element={<VerUsuarios />} />
          <Route path='/admin/crear-materias' element={<CrearMaterias />} />
          <Route path='/admin/asignar-cursos' element={<AsignarCursos />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

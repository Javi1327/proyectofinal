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
import AlumnoView from './pages/AlumnoView';
import VerNotasAlumnos from './components/VerNotasAlumnos';
import TareasAlumno from './components/TareasAlumno';
import Foro from './components/Foro';
import AdminView from './Pages/AdminView';
import CrearMaterias from './components/CrearMaterias';
import AdminUsuarios from './components/AdminUsuarios';
import MisCursos from './components/MisCursos';
import 'bootstrap/dist/css/bootstrap.min.css';
import Perfil from "./components/Perfil";



const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/carga-alumnos" element={<CargaAlumnos />} />
          <Route path="/profesor/home" element={<ProfesorView />} />
          <Route path="/profesor/subir-notas" element={<SubirNotas />} />
          <Route path="/profesor/mis-cursos" element={<MisCursos/>} />
          <Route path="/preceptor/home" element={<PreceptorView />} />
          <Route path="/preceptor/cargar-alumnos" element={<Alumno />} />
          <Route path="/preceptor/ver-alumnos" element={<VerAlumnos />} />
          <Route path="/preceptor/ver-cursos" element={<VerCursos />} />
          <Route path='/preceptor/Dar-asistencias' element={<Asistencia />} />
          <Route path="/alumno/home" element={<AlumnoView />} />
          <Route path="/alumno/ver-notas" element={<VerNotasAlumnos />} />
          <Route path="/alumno/tareas-alumno" element={<TareasAlumno />} />
          <Route path="/alumno/foro" element={<Foro />} />
          <Route path="/admin/home" element={<AdminView />} />
          <Route path="/admin/administrar-usuarios" element={<AdminUsuarios/>}/>
          <Route path='/admin/crear-materias' element={<CrearMaterias />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

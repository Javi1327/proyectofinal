import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { UserProvider } from './context/UserContext';

import Navbar from './components/Navbar';
import Footer from './Pages/Home/Footer';

import Login from './components/Login';
import Home from './components/Home';
import Perfil from './components/Perfil';
import ProfesorView from './pages/ProfesorView';
import SubirNotas from './components/SubirNotas';
import MisCursos from './components/MisCursos';
import PreceptorView from './pages/PreceptorView';
import VerCursos from './components/VerCursos';
import VerAlumnos from './components/VerAlumnos';
import Asistencia from './components/Asistencia';
import AlumnoView from './pages/AlumnoView';
import VerNotasAlumnos from './components/VerNotasAlumnos';
import TareasAlumno from './components/TareasAlumno';
import Foro from './components/Foro';
import AdminView from './Pages/AdminView';
import CrearMaterias from './components/CrearMaterias';
import AdminUsuarios from './components/AdminUsuarios';
import VerAsistenciasAlumno from './components/VerAsistenciaAlumno';
import CargaAlumnos from './components/CargaAlumnos';

import './App.css';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />

          <div className="app-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/perfil" element={<Perfil />} />

              <Route path="/profesor/home" element={<ProfesorView />} />
              <Route path="/profesor/subir-notas" element={<SubirNotas />} />
              <Route path="/profesor/mis-cursos" element={<MisCursos />} />

              <Route path="/preceptor/home" element={<PreceptorView />} />
              <Route path="/preceptor/ver-cursos" element={<VerCursos />} />
              <Route path="/preceptor/ver-alumnos" element={<VerAlumnos />} />
              <Route path="/preceptor/dar-asistencias" element={<Asistencia />} />
              <Route path="/preceptor/cargar-alumnos" element={<CargaAlumnos />} />

              <Route path="/alumno/home" element={<AlumnoView />} />
              <Route path="/alumno/ver-notas" element={<VerNotasAlumnos />} />
              <Route path="/alumno/tareas-alumno" element={<TareasAlumno />} />
              <Route path="/alumno/ver-asistencia" element={<VerAsistenciasAlumno />} />
              <Route path="/alumno/foro" element={<Foro />} />

              <Route path="/admin/home" element={<AdminView />} />
              <Route path="/admin/administrar-usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/crear-materias" element={<CrearMaterias />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

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
          <Route path="/preceptor" element={<PreceptorView />} />
          <Route path="/preceptor/cargar-alumnos" element={<Alumno />} />
          <Route path="/preceptor/ver-alumnos" element={<VerAlumnos />} />
          <Route path="/preceptor/ver-cursos" element={<VerCursos />} />
          <Route path='/preceptor/Dar-asistencias' element={<Asistencia />} />
          <Route path="/alumno" element={<AlumnoView />} />
          <Route path="/alumno/ver-notas" element={<VerNotasAlumnos />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';
import Footer from './Pages/Home/Footer';

const App = () => {
  return (
      < BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          </Routes>
        <Footer/>
      </BrowserRouter>
  );
};

export default App;

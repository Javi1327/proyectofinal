import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;

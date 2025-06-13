import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pestañas/index';
import Productos from './pestañas/productos';
import Contacto from './pestañas/contacto';
import Carrito from './pestañas/carrito';
import Login from './pestañas/login';
import Finalizar from './finalizar/finalizar_compra'
import Gracias from './finalizar/gracias/gracias'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<Productos />} /> 
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/finalizar_compra" element={<Finalizar/>} />
        <Route path="/gracias" element={<Gracias/>} />
      </Routes>
    </Router>
  );
};

export default App;

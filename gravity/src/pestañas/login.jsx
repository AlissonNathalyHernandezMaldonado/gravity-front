import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../css1/login.css";

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/backend-gravity/login.php', {
        correo,
        clave: contrasena
      });

      const res = response.data;
      console.log("Respuesta del backend:", res);

      if (res.success) {
        localStorage.setItem('token', res.token || '');
        localStorage.setItem('id_rol', res.id_rol);

        switch (res.id_rol) {
          case 1:
            window.location.href = '/administrador';
            break;
          case 2:
            window.location.href = '/finalizar_compra';
            break;
          default:
            Swal.fire('Error', 'Rol no reconocido', 'error');
        }
      } else {
        Swal.fire('Error', res.message || 'Correo o contraseña incorrectos', 'error');
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire('Error', 'No se pudo conectar al servidor.', 'error');
    }
  };

  return (
    <div className="login-body">
      <div className="bubbles">
        {[...Array(15)].map((_, i) => (
          <span key={i} className="bubble"></span>
        ))}
      </div>
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

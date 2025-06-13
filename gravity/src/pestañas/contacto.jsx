import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import logo from "../img/logog.png";
import fondo from "../img/carousel2.png";

const Contacto = () => {
  const estilos = `
    body {
      font-family: Arial, sans-serif;
      padding: 0;
      margin: 0px;
      background: url(${fondo}) no-repeat center center fixed;
      background-size: cover;
      color: #333;
    }

    .container {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      text-align: center;
      padding: 20px;
      max-width: 600px;
      width: 100%;
      margin: 4px auto;
    }

    h2 {
      color: #222;
      font-size: 24px;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .contact-item {
      margin: 15px 0;
    }

    .contact-item a {
      text-decoration: none;
      font-size: 18px;
      color: #007bff;
      font-weight: bold;
      transition: 0.3s;
    }

    .contact-item a:hover {
      color: #0056b3;
    }

    .contact-button {
      display: inline-block;
      background-color: #25d366;
      color: white;
      padding: 12px 20px;
      font-size: 18px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
      transition: 0.3s;
    }

    .contact-button:hover {
      background-color: #1da851;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: estilos }} />

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <picture className="sidebar__picture2">
            <Link to="/">
              <img
                src={logo}
                style={{ width: "175px", height: "92px" }}
                alt="Logo"
              />
            </Link>
            <div className="navbar-brand"></div>
          </picture>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-bag-heart-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132" />
              </svg>
              <li className="nav-item">
                <Link className="nav-link" to="/productos">
                  Categoria
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <h2>Ayuda y Contáctenos</h2>
        <hr />
        <p>¿Tienes dudas? Estamos aquí para ayudarte.</p>
        <hr />
        <div className="contact-item">
          📞 <strong>Teléfono:</strong>{" "}
          <a href="tel:3054146810">+3054146810</a>
        </div>
        <hr />
        <div className="contact-item">
          ✉️ <strong>Correo electrónico:</strong>{" "}
          <a href="mailto:Gravity.SENA.com">Gravity.SENA.com</a>
        </div>
        <div className="contact-item">
          💬 <strong>WhatsApp:</strong>
          <br />
          <a
            href="https://wa.link/166n1b"
            className="contact-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escríbenos en WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};

export default Contacto;

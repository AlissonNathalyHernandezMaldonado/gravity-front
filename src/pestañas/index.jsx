import React, { useState, useEffect } from "react";
import logo from "../img/logog.png";
import carrucel from "../img/carousel.png";
import carousel1 from "../img/carousel1.png";
import carousel3 from "../img/carousel3.png";

const images = [
  {
    src: carrucel,
    title: "¡Descubre el futuro de la moda!",
    text: "Ropa y calzado exclusivo que redefine tu estilo.",
  },
  {
    src: carousel1,
    title: "¡Nuevas colecciones ya disponibles!",
    text: "Vístete con lo último en tendencias.",
  },
  {
    src: carousel3,
    title: "Calzado cómodo y moderno",
    text: "Encuentra el par perfecto para tu estilo.",
  },
];

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <a href="./index.php" className="navbar-brand">
          <img src={logo} alt="Logo" className="logo" />
          <h1>TU ENERGIA NUESTRO COMPROMISO!!!</h1>
        </a>
      </header>

      {/* Carrusel */}
      <div className="carousel">
        {images.map((item, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
          >
            <img src={item.src} alt={`Slide ${index}`} />
            <div className="carousel-caption">
              <h1>{item.title}</h1>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección destacada */}
      <section className="destacado">
        <h2>✨ ¡Descubre tu estilo único!</h2>
        <p>Conoce nuestra nueva colección de ropa urbana y sneakers edición limitada.</p>
        <a href="/productos" className="btn">Ver productos</a> {/* Aquí va la ruta */}
      </section>


      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/3054146810"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        title="¡Chatea con nosotros!"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/220/220236.png"
          alt="WhatsApp"
        />
      </a>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f8f9fa;
        }

        .navbar {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo {
          width: 175px;
          height: 92px;
        }

        .navbar h1 {
          margin-left: 20px;
          color: #f12;
          font-size: 1.5rem;
        }

        .carousel {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .carousel-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        .carousel-slide.active {
          opacity: 1;
          z-index: 1;
        }

        .carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .carousel-caption {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
          text-align: center;
        }

        .carousel-caption h1 {
          font-size: 3rem;
          font-weight: bold;
        }

        .carousel-caption p {
          font-size: 1.5rem;
        }

        .destacado {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 50px;
          margin: 80px auto;
          max-width: 900px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .destacado h2 {
          font-size: 2.8rem;
          font-weight: bold;
        }

        .destacado p {
          font-size: 1.5rem;
        }

        .btn {
          padding: 16px 36px;
          font-size: 1.3rem;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
        }

        .whatsapp-float img {
          width: 70px;
          height: 70px;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .whatsapp-float img:hover {
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .carousel-caption h1 {
            font-size: 2rem;
          }

          .carousel-caption p {
            font-size: 1.1rem;
          }

          .destacado h2 {
            font-size: 2rem;
          }

          .destacado p {
            font-size: 1.1rem;
          }

          .btn {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

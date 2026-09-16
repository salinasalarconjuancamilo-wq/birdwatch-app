import React, { useState, useEffect } from 'react';
import './carrusel.css';

const Carrusel = ({ imagenes }) => {
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    if (!imagenes || imagenes.length === 0) return;
    const timer = setInterval(() => {
      setIndiceActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [imagenes]);

  if (!imagenes || imagenes.length === 0) return null;

  const irAlAnterior = () => {
    setIndiceActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const irAlSiguiente = () => {
    setIndiceActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const actual = imagenes[indiceActual];

  return (
    <div className="carrusel-contenedor">
      <button className="carrusel-flecha izquierda" onClick={irAlAnterior}>&#10094;</button>

      <div className="carrusel-slide">
        <img src={actual.imagen} alt={actual.nombre} />
        <div className="carrusel-info">
          <h3 className="carrusel-nombre">{actual.nombre}</h3>
          <p className="carrusel-descripcion">{actual.descripcion}</p>
        </div>
      </div>

      <button className="carrusel-flecha derecha" onClick={irAlSiguiente}>&#10095;</button>

      <div className="carrusel-indicadores">
        {imagenes.map((_, idx) => (
          <span
            key={idx}
            className={`carrusel-punto ${indiceActual === idx ? 'activo' : ''}`}
            onClick={() => setIndiceActual(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrusel; 

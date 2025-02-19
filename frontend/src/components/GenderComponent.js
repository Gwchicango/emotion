import { useState, useEffect } from "react";
import "./componentCSS/genderComponent.css";

const ComponenteGenero = () => {
  const [genero, setGenero] = useState("");

  useEffect(() => {
    enlazarEventos();
  }, []);

  function enlazarEventos() {
    window.addEventListener("CY_FACE_GENDER_RESULT", (evt) => {
      setGenero(evt.detail.output.mostConfident || "");
    });
  }

  return (
    <div className="genero-container">
      <div className="genero-contenido">
        <p className="genero-texto">{genero}</p>
        {genero.toLocaleLowerCase() === 'male' && <img alt="Hombre" src="male.jpg" className="genero-imagen" />}
        {genero.toLocaleLowerCase() === 'female' && <img alt="Mujer" src="female.png" className="genero-imagen" />}
      </div>
    </div>
  );
};

export default ComponenteGenero;
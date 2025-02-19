import { useState, useEffect } from "react";
import "./componentCSS/dominantEmotionComponent.css";

const ComponenteEmocionDominante = () => {
  const [emocionDominante, setEmocionDominante] = useState("");

  useEffect(() => {
    function bindEvents() {
      window.addEventListener("CY_FACE_EMOTION_RESULT", manejarEventoEmocion);
    }

    function manejarEventoEmocion(evt) {
      const emocion = evt.detail.output.dominantEmotion || "";
      setEmocionDominante(traducirEmocion(emocion));
    }

    function traducirEmocion(emocion) {
      const emociones = {
        Angry: "Enojo",
        Disgust: "Disgusto",
        Fear: "Miedo",
        Happy: "Felicidad",
        Sad: "Tristeza",
        Surprise: "Sorpresa",
        Neutral: "Neutral"
      };
      return emociones[emocion] || emocion;
    }

    bindEvents();

    return () => {
      window.removeEventListener("CY_FACE_EMOTION_RESULT", manejarEventoEmocion);
    };
  }, []);

  return (
    <div className="emocion-dominante-container">
      <p className="emocion-dominante-texto">{emocionDominante}</p>
    </div>
  );
};

export default ComponenteEmocionDominante;
import { useState, useEffect, useRef } from "react";
import { saveAnalisisAtention } from "../api/serverApi";
import "./componentCSS/engagementComponent.css";

const ComponenteCompromiso = ({ videoEl, idSesion }) => {
  const [activacion, setActivacion] = useState(0);
  const [valencia, setValencia] = useState(0);
  const [atencion, setAtencion] = useState(0);
  const timeout = useRef(undefined);

  const engagementRef = useRef({
    activacion: 0,
    valencia: 0,
    atencion: 0,
  });

  useEffect(() => {
    function resetTimeout() {
      let to = timeout.current;
      clearTimeout(to);
      to = setTimeout(() => {
        setAllToZero();
      }, 3000);

      timeout.current = to;
    }

    function bindEvent() {
      window.addEventListener(
        "CY_FACE_AROUSAL_VALENCE_RESULT",
        handleArousalValenceEvents
      );
      window.addEventListener("CY_FACE_ATTENTION_RESULT", handleAttentionEvents);
    }

    function handleArousalValenceEvents(evt) {
      const newValencia = Math.abs(evt.detail.output.valence * 100) || 0;
      const newActivacion = Math.abs(evt.detail.output.arousal * 100) || 0;
      setValencia(newValencia);
      setActivacion(newActivacion);
      engagementRef.current.valencia = newValencia;
      engagementRef.current.activacion = newActivacion;
      resetTimeout();
    }

    function handleAttentionEvents(evt) {
      if (evt.detail.output.attention > 0.1) {
        const newAtencion = evt.detail.output.attention * 100 || 0;
        setAtencion(newAtencion);
        engagementRef.current.atencion = newAtencion;
        resetTimeout();
      }
    }

    function setAllToZero() {
      setActivacion(0);
      setValencia(0);
      setAtencion(0);
      engagementRef.current.activacion = 0;
      engagementRef.current.valencia = 0;
      engagementRef.current.atencion = 0;
    }

    bindEvent();

    return () => {
      window.removeEventListener(
        "CY_FACE_AROUSAL_VALENCE_RESULT",
        handleArousalValenceEvents
      );
      window.removeEventListener(
        "CY_FACE_ATTENTION_RESULT",
        handleAttentionEvents
      );
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = {
        ...engagementRef.current,
        idSeccion: idSesion, // Añade idSesion a los datos de compromiso
      };

      try {
        await saveAnalisisAtention(data);
        console.log("Datos enviados al servidor de compromiso:", data);
      } catch (error) {
        console.error('Error al enviar datos al servidor:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [idSesion]);

  return (
    <>
      <div id="rangesContainer">
        <div className="rangeContainer">
          <div>
            <div>
              <input
                type="range"
                min="1"
                max="100"
                value={activacion || 0}
                onChange={() => {}}
                className="slider"
                color="#E29219"
              />
            </div>
            <span id="title">Activación</span>
          </div>
        </div>
        <div className="rangeContainer">
          <div>
            <div>
              <input
                type="range"
                min="1"
                max="100"
                value={valencia || 0}
                onChange={() => {}}
                className="slider"
                color="#19E282"
              />
            </div>
            <span id="title">Valencia</span>
          </div>
        </div>
        <div className="rangeContainer">
          <div>
            <div>
              <input
                type="range"
                min="1"
                max="100"
                value={atencion || 0}
                onChange={() => {}}
                className="slider"
                color="#FFFFFF"
              />
            </div>
            <span id="title">Atención</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponenteCompromiso;
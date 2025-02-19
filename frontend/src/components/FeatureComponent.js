import { useState, useEffect, useRef } from "react";
import "./componentCSS/featureComponent.css"

const ComponenteCaracteristicas = () => {
  const [caracteristicas, setCaracteristicas] = useState([]);
  const timeout = useRef(undefined);

  useEffect(() => {
    function reiniciarTimeout() {
      let to = timeout.current;
      clearTimeout(to);
      to = setTimeout(() => {
        setCaracteristicas([]);
      }, 3000);

      timeout.current = to;
    }

    function extraer(obj, n) {
      let ordenable = [];
      for (var caracteristica in obj) {
        ordenable.push([caracteristica, obj[caracteristica]]);
      }

      ordenable.sort(function (a, b) {
        return b[1] - a[1];
      });
      return ordenable.slice(0, n);
    }

    function enlazarEvento() {
      window.addEventListener("CY_FACE_FEATURES_RESULT", manejarEventoCaracteristicas);
    }

    function manejarEventoCaracteristicas(evt) {
      reiniciarTimeout();
      let caracteristicas = extraer(evt.detail.output.features, 5);
      setCaracteristicas(caracteristicas.map(([caracteristica]) => traducirCaracteristica(caracteristica)));
    }

    function traducirCaracteristica(caracteristica) {
      const traducciones = {
        "smile": "Sonrisa",
        "eyeglasses": "Gafas",
        "sunglasses": "Gafas de sol",
        "beard": "Barba",
        "mustache": "Bigote",
        "eyesOpen": "Ojos abiertos",
        "mouthOpen": "Boca abierta",
        "headwear": "Sombrero",
        "makeup": "Maquillaje",
        "noMakeup": "Sin maquillaje",
        "hat": "Sombrero",
        "scarf": "Bufanda",
        "glasses": "Gafas",
        "noGlasses": "Sin gafas",
        "mask": "Mascarilla",
        "noMask": "Sin mascarilla",
        "blackHair": "Cabello negro",
        "eyebrowsBushy": "Cejas pobladas",
        "ovalFace": "Cara ovalada",
        "straightHair": "Cabello lacio",
        "beard5OClockShadow": "Barba de sombra de las 5 en punto"
      };
      return traducciones[caracteristica] || caracteristica;
    }

    enlazarEvento();
  }, []);

  return (
    <>
      <div className="wrap">
        <h2>Caracteristicas</h2>
        {caracteristicas.map((caracteristica, index) => (
          <span key={index} className="feature fade-in"> {caracteristica} </span>
        ))}
      </div>
    </>
  );
};

export default ComponenteCaracteristicas;
import { useState, useEffect, useRef } from "react";
import "./componentCSS/ageComponent.css";

const AgeComponent = () => {
  const [ageValue, setAgeValue] = useState(0);
  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(10);
  const timeout = useRef(undefined);

  useEffect(() => {
    function resetTimeout() {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setAgeValue(0);
        setAgeMin(0);
        setAgeMax(0);
      }, 3000);
    }

    function handleAgeEvent(evt) {
      resetTimeout();
      const age = Math.floor(evt.detail.output.numericAge) || 0;
      setAgeValue(age);
      setAgeMin(Math.floor(age / 10) * 10);
      setAgeMax((Math.floor(age / 10) + 1) * 10);
    }

    window.addEventListener("CY_FACE_AGE_RESULT", handleAgeEvent);

    return () => {
      window.removeEventListener("CY_FACE_AGE_RESULT", handleAgeEvent);
    };
  }, []);

  return (
    <div className="age-component">
      <p className="age-title">Edad Estimada</p>
      <div className="age-slider-container">
        <span className="age-label" id="ageMin">{ageMin}</span>
        <input
          type="range"
          min="1"
          max="100"
          value={ageValue || 0}
          onChange={() => {}}
          className="age-slider"
        />
        <span className="age-label" id="ageMax">{ageMax}</span>
      </div>
      <span className="age-likely">Edad Probable: {ageValue}</span>
    </div>
  );
};

export default AgeComponent;
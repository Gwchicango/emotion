import { useState, useEffect, useRef } from "react";
import "./componentCSS/emotionBarsComponent.css";
import SingleBarComponent from "./SingleBarComponent";
import { saveEmotionData } from "../api/serverApi";

const EmotionBarsComponent = ({ videoEl, idSesion, testComplete, showDuringResults }) => {
  const emotionHistory = useRef([]);
  const [enojo, setEnojo] = useState(0);
  const [disgusto, setDisgusto] = useState(0);
  const [miedo, setMiedo] = useState(0);
  const [felicidad, setFelicidad] = useState(0);
  const [tristeza, setTristeza] = useState(0);
  const [sorpresa, setSorpresa] = useState(0);
  const [neutral, setNeutral] = useState(0);

  const emotionsRef = useRef({
    enojado: 0,
    disgusto: 0,
    miedo: 0,
    felicidad: 0,
    tristeza: 0,
    sorpresa: 0,
    neutral: 0,
  });

  useEffect(() => {
    function bindEvent() {
      window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    }

    function handleEmotionEvent(evt) {
      const newEmotions = {
        angry: evt.detail.output.emotion.Angry * 100,
        disgust: evt.detail.output.emotion.Disgust * 100,
        fear: evt.detail.output.emotion.Fear * 100,
        happy: evt.detail.output.emotion.Happy * 100,
        sad: evt.detail.output.emotion.Sad * 100,
        surprise: evt.detail.output.emotion.Surprise * 100,
        neutral: evt.detail.output.emotion.Neutral * 100,
      };

      setEnojo(newEmotions.angry);
      setDisgusto(newEmotions.disgust);
      setMiedo(newEmotions.fear);
      setFelicidad(newEmotions.happy);
      setTristeza(newEmotions.sad);
      setSorpresa(newEmotions.surprise);
      setNeutral(newEmotions.neutral);

      emotionsRef.current = newEmotions;
    }

    bindEvent();

  
  }, [idSesion]);

  useEffect(() => {
    // Guardar datos en el historial cada segundo
    const historyInterval = setInterval(() => {
      if (!testComplete) {
        emotionHistory.current.push({
          ...emotionsRef.current,
          timestamp: Date.now()
        });
      }
    }, 1000);

    return () => clearInterval(historyInterval);
  }, [testComplete]);

  useEffect(() => {
    if (testComplete) {
      console.log("Test completado - EmotionBarsComponent");
      
      // Filtrar valores cero y calcular promedios
      const filteredHistory = emotionHistory.current.filter(entry => 
        entry.angry > 0 || entry.disgust > 0 || entry.fear > 0 || 
        entry.happy > 0 || entry.sad > 0 || entry.surprise > 0 || entry.neutral > 0
      );

      if (filteredHistory.length > 0) {
        const sum = filteredHistory.reduce((acc, entry) => {
          return {
            angry: acc.angry + entry.angry,
            disgust: acc.disgust + entry.disgust,
            fear: acc.fear + entry.fear,
            happy: acc.happy + entry.happy,
            sad: acc.sad + entry.sad,
            surprise: acc.surprise + entry.surprise,
            neutral: acc.neutral + entry.neutral
          };
        }, {
          angry: 0, disgust: 0, fear: 0, 
          happy: 0, sad: 0, surprise: 0, neutral: 0
        });

        const averages = {
          angry: sum.angry / filteredHistory.length,
          disgust: sum.disgust / filteredHistory.length,
          fear: sum.fear / filteredHistory.length,
          happy: sum.happy / filteredHistory.length,
          sad: sum.sad / filteredHistory.length,
          surprise: sum.surprise / filteredHistory.length,
          neutral: sum.neutral / filteredHistory.length,
          idSeccion: idSesion
        };

        console.log("Promedios de emociones:", averages);
        saveEmotionData(averages)
          .then(() => console.log("Datos finales de emociones enviados"))
          .catch(err => console.error("Error enviando datos finales:", err));
      }
    }
  }, [testComplete, idSesion]);

  return (
    <div id="emotionsContainer">
      <SingleBarComponent name="Enojo" color1="#E21919" color2="#984E4E" value={enojo}></SingleBarComponent>
      <SingleBarComponent name="Disgusto" color1="#37D042" color2="#1A6420" value={disgusto}></SingleBarComponent>
      <SingleBarComponent name="Miedo" color1="#FF007A" color2="#906490" value={miedo}></SingleBarComponent>
      <SingleBarComponent name="Felicidad" color1="#FFEA00" color2="#8F8A57" value={felicidad}></SingleBarComponent>
      <SingleBarComponent name="Tristeza" color1="#6CB4DF" color2="#4E8698" value={tristeza}></SingleBarComponent>
      <SingleBarComponent name="Sorpresa" color1="#F5B9C3" color2="#664E98" value={sorpresa}></SingleBarComponent>
      <SingleBarComponent name="Neutral" color1="#A9A9A9" color2="#737373" value={neutral}></SingleBarComponent>
    </div>
  );
};

export default EmotionBarsComponent;

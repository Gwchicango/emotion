import { useEffect, useRef, useState } from "react";
import { useExternalScript } from "../../helpers/ai-sdk/externalScriptsLoader";
import { getAiSdkControls } from "../../helpers/ai-sdk/loader";

import './dashboard.css';

import GenderComponent from "../../components/GenderComponent";
import AgeComponent from "../../components/AgeComponent";
import DominantEmotionComponent from "../../components/DominantEmotionComponent";
import FeatureComponent from "../../components/FeatureComponent";
import EngagementComponent from "../../components/EngagementComponent";
import FaceTrackerComponent from "../../components/FaceTrackerComponent";
import MoodComponent from "../../components/MoodComponent";
import EmotionBarsComponent from "../../components/EmotionBarsComponent";
import Footer from "../../components/Footer";

function Page() {
  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
  const videoEl = useRef(undefined);
  const [isMoodExpanded, setIsMoodExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el estado de carga

  useEffect(() => {
    videoEl.current = document.getElementById("videoEl");
    let aiSdkControls;

    async function getAiSdk() {
      if (aiSdkState === "ready" && mphToolsState === "ready") {
        aiSdkControls = await getAiSdkControls();
        const { source, start } = aiSdkControls;
        await source.useCamera({
          toVideoElement: videoEl.current,
        });
        await start();
      }
      setIsLoading(false); // Ocultar el indicador de carga una vez que la página haya terminado de renderizarse
    }

    getAiSdk();

    return () => {
      if (aiSdkControls) {
        aiSdkControls.stop();
      }
      if (videoEl.current && videoEl.current.srcObject) {
        videoEl.current.srcObject.getTracks().forEach(track => track.stop());
        videoEl.current.srcObject = null;
      }
    };
  }, [aiSdkState, mphToolsState]);

  const toggleMoodExpand = () => {
    setIsMoodExpanded(!isMoodExpanded);
  };

  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      videoEl.current.srcObject = stream;
    } catch (err) {
      console.error("Error al capturar la pantalla: ", err);
    }
  };

  return (
    <div className="App">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className={`App-body ${isLoading ? 'hidden' : ''}`}>
        <div className="App-content">
          <div className="video-container">
            <video id="videoEl" className="video-element" autoPlay playsInline></video>
            <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
            <div className="emotion-bars-component">
              <h2>Barras de Emoción</h2>
              <EmotionBarsComponent />
            </div>
          </div>
          <button className="capture-button" onClick={startScreenCapture}>Iniciar Captura de Pantalla</button>
          
          <hr className="separator-line" />
          <div className="components-container grid-container">

            <div className="component age-component">
                <h2>Edad</h2>
                <AgeComponent />
            </div>
            <div className="component engagement-component">
                <h2>Compromiso</h2>
                <EngagementComponent />
            </div>
          </div>
          
          <hr className="separator-line" />
          <div className="components-container grid-container">
          <div className={`component mood-component ${isMoodExpanded ? 'expanded' : ''}`}>
              <h2>Estado de Ánimo</h2>
              <MoodComponent />
              <button className="expand-button" onClick={toggleMoodExpand}>
                {isMoodExpanded ? 'Cerrar' : 'Ampliar'}
              </button>
            </div>
              <FeatureComponent />
          </div>
          <hr className="separator-line" />
          <div className="component-feature-component">
          <h2>Género</h2>
          <GenderComponent />
            <h2>Emoción Dominante</h2>
              <DominantEmotionComponent />
            </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
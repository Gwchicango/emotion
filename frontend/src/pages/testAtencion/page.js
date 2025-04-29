import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Timer, Info } from 'lucide-react';
import TestResults from '../../components/TestResults';
import { useExternalScript } from "../../helpers/ai-sdk/externalScriptsLoader";
import { getAiSdkControls } from "../../helpers/ai-sdk/loader";
import FaceTrackerComponent from "../../components/FaceTrackerComponent";
import EmotionBarsComponent from "../../components/EmotionBarsComponent";
import EngagementComponent from "../../components/EngagementComponent";
import { useNavigate } from 'react-router-dom';
import {crearSeccion, modificarSeccion} from '../../api/seccionTestApi';

import './test.css';

const D2AttentionTest = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selections, setSelections] = useState([]);
  const [testComplete, setTestComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0); // Nuevo estado para el tiempo transcurrido
  const [showReportButton, setShowReportButton] = useState(false); // Nuevo estado para el botón de reporte
  const [idSesion, setIdSesion] = useState(null); // Nuevo estado para idSesion
  const lineRefs = useRef([]);
  const videoEl = useRef(undefined);
  const navigate = useNavigate(); // Hook para redirigir
  const [fechaInicio, setFechaInicio] = useState(null); // Nuevo estado para el tiempo transcurrido



  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem('hasReloaded');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

       useEffect(() => {
      const initializeVideo = async () => {
        if (videoEl.current && aiSdkState === "ready" && mphToolsState === "ready") {
          const { source, start } = await getAiSdkControls();
          await source.useCamera({
            toVideoElement: videoEl.current,
          });
          await start();
        }
      };
    
      initializeVideo();
    }, [aiSdkState, mphToolsState, videoEl.current]);
    
    const startTest = async () => {
      try {
        // Crear una nueva sesión
        const id_p = parseInt(sessionStorage.getItem('idInterno'), 10);
        setFechaInicio(new Date().toISOString());
        const nuevaSesion = {
          idSeccion: Math.floor(Math.random() * 1000), // Genera un ID de sesión aleatorio
          fechaHoraInicio: null,
          fechaHoraFin: null, // Se actualizará al finalizar el test
          persona: { id: id_p }, // Reemplaza con el ID de la conferencia correspondiente
        };
        const response = await crearSeccion(nuevaSesion);
        setIdSesion(response.id); // Guarda el idSesion en el estado
        console.log('Sesión creada:', response);
    
        setIsActive(true);
        setTimeLeft(20);
        setCurrentLine(0);
        setTestComplete(false);
        setSelections([]);
        setShowInstructions(false);
        setTestLines(generateTestLines());
        setElapsedTime(0); // Reiniciar el tiempo transcurrido
        //autoMark(); // Llamar a la función de automarcado
    
        videoEl.current = document.createElement("video");
        videoEl.current.id = "videoEl";
        videoEl.current.className = "video-element";
        videoEl.current.autoPlay = true;
        videoEl.current.playsInline = true;
        document.body.appendChild(videoEl.current);
      } catch (error) {
        console.error('Error al iniciar el test y guardar la sesión:', error);
      }
    };
  
  const endTest = useCallback(async () => {
    try {
      const fechaHoraFin = new Date().toISOString();
      const fechaHoraInicio = fechaInicio;
      await modificarSeccion(idSesion, { fechaHoraFin, fechaHoraInicio });
      console.log("Llamando a endTest() - Marcando testComplete como true");
      setIsActive(false);
      setTestComplete(true);
      setShowReportButton(true);
      console.log("Estado actual:", {isActive, testComplete, showReportButton});
    } catch (error) {
      console.error('Error al finalizar el test y guardar la hora de finalización:', error);
    }
  }, [idSesion, fechaInicio]);

  const generateStimulusTypes = () => {
    const types = [];
    const letters = ['p', 'q'];

    letters.forEach(letter => {
      const markCombinations = [
        { top: 0, bottom: 1 },
        { top: 1, bottom: 0 },
        { top: 0, bottom: 2 },
        { top: 2, bottom: 0 },
        { top: 1, bottom: 1 },
        { top: 2, bottom: 1 },
        { top: 1, bottom: 2 },
        { top: 2, bottom: 2 }
      ];

      markCombinations.forEach(combo => {
        types.push({
          letter,
          topMarks: combo.top,
          bottomMarks: combo.bottom,
          isTarget: letter === 'p' && (combo.top + combo.bottom === 2 || combo.top + combo.bottom === 3)
        });
      });
    });
    return types;
  };

  const generateTestLine = () => {
    const items = [];
    const stimulusTypes = generateStimulusTypes();
    let targetCount = 0;

    for (let i = 0; i < 57; i++) {
      const stimulusType = { ...stimulusTypes[Math.floor(Math.random() * stimulusTypes.length)] };
      stimulusType.selected = false;
      stimulusType.id = `${i}-${Math.random()}`;

      if (stimulusType.isTarget) targetCount++;
      items.push(stimulusType);
    }

    while (targetCount < 25 || targetCount > 26) {
      const index = Math.floor(Math.random() * 57);
      const currentIsTarget = items[index].isTarget;

      if (targetCount < 25 && !currentIsTarget) {
        const targetStimulus = { ...stimulusTypes.find(t => t.isTarget), selected: false, id: `${index}-${Math.random()}` };
        items[index] = targetStimulus;
        targetCount++;
      } else if (targetCount > 26 && currentIsTarget) {
        const nonTargetStimulus = { ...stimulusTypes.find(t => !t.isTarget), selected: false, id: `${index}-${Math.random()}` };
        items[index] = nonTargetStimulus;
        targetCount--;
      }
    }

    return items;
  };

  const generateTestLines = () => {
    const lines = [];
    const blockLines = [
      generateTestLine(),
      generateTestLine(),
      generateTestLine()
    ].map(line =>
      line.map(item => ({ ...item, id: `${Math.random()}` }))
    );

    for (let i = 0; i < 14; i++) {
      if (i === 0 || i === 13) {
        lines.push(generateTestLine());
      } else {
        const blockPosition = (i - 1) % 3;
        lines.push(
          blockLines[blockPosition].map(item => ({
            ...item,
            selected: false,
            id: `${i}-${Math.random()}`
          }))
        );
      }
    }

    return lines;
  };

  const [testLines, setTestLines] = useState(generateTestLines());

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentLine < 13) {
              setCurrentLine((prev) => prev + 1);
              return 20;
            } else {
              setIsActive(false);
              setTestComplete(true);
              setShowReportButton(true);
              endTest(); // Mover endTest aquí para que se ejecute después de actualizar los estados
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, currentLine, endTest]);

  useEffect(() => {
    let elapsedTimer;
    if (isActive) {
      elapsedTimer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (testComplete) {
      clearInterval(elapsedTimer);
    }
    return () => clearInterval(elapsedTimer);
  }, [isActive, testComplete]);

  const toggleItem = (lineIndex, itemIndex) => {
    if (lineIndex === currentLine && isActive) {
      setTestLines(prevLines => {
        const newLines = [...prevLines];
        newLines[lineIndex] = [...newLines[lineIndex]];
        newLines[lineIndex][itemIndex] = {
          ...newLines[lineIndex][itemIndex],
          selected: !newLines[lineIndex][itemIndex].selected
        };
        return newLines;
      });

      setSelections(prev => [
        ...prev,
        {
          line: lineIndex,
          item: itemIndex,
          id: testLines[lineIndex][itemIndex].id,
          isTarget: testLines[lineIndex][itemIndex].isTarget,
          letter: testLines[lineIndex][itemIndex].letter,
          topMarks: testLines[lineIndex][itemIndex].topMarks,
          bottomMarks: testLines[lineIndex][itemIndex].bottomMarks,
          timestamp: new Date().getTime(),
        },
      ]);
    }
  };

  const autoMark = () => {
    const newSelections = [];
    const newTestLines = testLines.map((line, lineIndex) => {
      return line.map((item, itemIndex) => {
        if (Math.random() < 0.2) { // 20% de probabilidad de marcar un elemento
          newSelections.push({
            line: lineIndex,
            item: itemIndex,
            id: item.id,
            isTarget: item.isTarget,
            letter: item.letter,
            topMarks: item.topMarks,
            bottomMarks: item.bottomMarks,
            timestamp: new Date().getTime(),
          });
          return { ...item, selected: true };
        }
        return item;
      });
    });
    setTestLines(newTestLines);
    setSelections(newSelections);
  };




   const calculateResults = () => {
    const scoringLines = testLines.slice(1, 13); // Excluir líneas 1 y 14
    const scoringSelections = selections.filter(s => s.line >= 1 && s.line < 13); // Excluir selecciones de líneas 1 y 14
  
    const totalTargets = scoringLines.flat().filter((item) => item.isTarget).length;
    const correctSelections = scoringSelections.filter((s) => s.isTarget).length;
    const incorrectSelections = scoringSelections.filter((s) => !s.isTarget);
  
    const totalResponses = scoringSelections.length;
    const totalCorrect = correctSelections;
    const errorsOmissions = totalTargets - totalCorrect;
  
    // Subdividir errores de comisión
    const errorsCommissions = {
      rayitas: incorrectSelections.filter(s => s.letter === 'p' && (s.topMarks + s.bottomMarks !== 2)).length,
      letras: incorrectSelections.filter(s => s.letter === 'q').length,
      dobles: incorrectSelections.filter(s => s.letter === 'p' && (s.topMarks + s.bottomMarks !== 2)).length,
    };
    const totalErrorsCommissions = errorsCommissions.rayitas + errorsCommissions.letras + errorsCommissions.dobles;
  
    const totalErrors = errorsOmissions + totalErrorsCommissions;
  
    // Calcular el tiempo total empleado para realizar el test (en segundos)
    const totalTime = elapsedTime; // Tiempo total transcurrido en segundos
  
    // Calcular la Efectividad Total (TOT)
    const effectivenessTotal = totalTime > 0 ? ((totalCorrect / totalTime) * 100).toFixed(2) : "0.0";
  
    // Calcular el Índice de Concentración (CON)
    const concentrationIndex = (totalCorrect + totalErrorsCommissions) > 0
      ? (totalCorrect / (totalCorrect + totalErrorsCommissions)).toFixed(2)
      : "0.0";
  
    // Calcular la Velocidad de Trabajo (VT)
    const workSpeed = totalTime > 0 ? (totalCorrect / totalTime).toFixed(2) : "0.0";
  
    // Calcular la Precisión (E %)
    const precision = totalResponses > 0 ? ((totalCorrect / totalResponses) * 100).toFixed(1) : "0.0";
  
    // Calcular el Índice de Variación (VAR)
    const variationIndex = totalCorrect > 0 ? ((totalErrors / totalCorrect) * 100).toFixed(2) : "0.0";
  
    const blockResults = [1, 2, 3, 4].map(blockNum => {
      const startLine = (blockNum - 1) * 3 + 1;
      const blockLines = testLines.slice(startLine, startLine + 3);
      const blockSelections = selections.filter(s =>
        s.line >= startLine && s.line < startLine + 3
      );
  
      const blockTargets = blockLines.flat().filter(item => item.isTarget).length;
      const blockCorrect = blockSelections.filter(s => s.isTarget).length;
      const blockIncorrect = blockSelections.filter(s => !s.isTarget).length;
      const blockAccuracy = blockCorrect + blockIncorrect > 0
        ? ((blockCorrect / (blockCorrect + blockIncorrect)) * 100).toFixed(1)
        : "0.0";
  
      return {
        block: blockNum,
        targets: blockTargets,
        correct: blockCorrect,
        incorrect: blockIncorrect,
        accuracy: blockAccuracy
      };
    });
  
    return {
      total: totalTargets,
      correct: totalCorrect,
      incorrect: incorrectSelections.length,
      omissions: errorsOmissions,
      commissions: totalErrorsCommissions,
      errorsCommissions: errorsCommissions,
      totalErrors: totalErrors,
      effectivenessTotal: effectivenessTotal,
      concentrationIndex: concentrationIndex,
      workSpeed: workSpeed,
      precision: precision,
      variationIndex: variationIndex,
      blocks: blockResults,
      totalResponses: totalResponses,
      totalTime: totalTime,
      idSesion: idSesion
    };
  };

  const renderItem = (item, lineIndex, itemIndex) => {
    const topDots = '•'.repeat(item.topMarks);
    const bottomDots = '•'.repeat(item.bottomMarks);

    return (
      <div
        key={item.id}
        className={`test-item ${item.selected ? 'selected' : ''} ${
          currentLine === lineIndex && isActive ? '' : 'inactive'
        }`}
        onClick={() => toggleItem(lineIndex, itemIndex)}
      >
        <div className="marks">{topDots}</div>
        <div className="letter">{item.letter}</div>
        <div className="marks">{bottomDots}</div>
      </div>
    );
  };

  const handleViewReport = () => {
    navigate('/report'); // Redirigir a la página de reportes
  };

  return (
    <div className="attention-test-content">
      <div className="card card-header">
        <div className="card-title">
          <div className="title-container">
            <span>Test de Atención D2-R</span>
            <Button onClick={() => setShowInstructions(!showInstructions)}>
              <Info className="icon" />
              Instrucciones
            </Button>
          </div>
          <div className="timer-container">
            <div className="timer">
              <Timer className="icon" />
              <span>{timeLeft}s</span>
            </div>
            <div className="line-info">Línea {currentLine + 1}/14</div>
          </div>
        </div>
      </div>

      <div className="card card-content">
        {showInstructions && (
          <div className="instructions">
            <h3>Instrucciones:</h3>
            <p>
              1. Marque todas las letras 'p' que tengan exactamente DOS marcas
              en total (arriba y/o abajo).
            </p>
            <p>2. Tiene 20 segundos por línea</p>
            <p>3. Solo puede marcar elementos en la línea activa.</p>
            <p>4. Sea lo más rápido y preciso posible.</p>
          </div>
        )}

        <div className="test-controls">
          <Button
            onClick={startTest}
            disabled={isActive}
            className="start-button"
          >
            {testComplete ? 'Reiniciar Test' : 'Iniciar Test'}
          </Button>
        </div>

        <div className="test-grid">
          {testLines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              <div
                className={`test-line ${currentLine === lineIndex ? 'active' : ''}`}
                ref={el => lineRefs.current[lineIndex] = el}
              >
                <div className="line-number">{lineIndex + 1}</div>
                <div className="line-items">
                  {line.map((item, itemIndex) =>
                    renderItem(item, lineIndex, itemIndex)
                  )}
                </div>
              </div>
              {lineIndex < testLines.length - 1 && (
                <div className="separator-line"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        {/*showReportButton && (
        <div className="report-button-container">
          <Button onClick={handleViewReport} className="report-button">
            Ver Reportes
          </Button>
        </div>
      )*/}

        {testComplete && (
          
          <TestResults results={calculateResults()} />
        )}
      </div>

        <div className={`floating-video-container ${!isActive ? 'results-mode' : ''}`}>
          {isActive && (
            <div className="timer-container">
              <div className="timer">
                <Timer className="icon" />
                <span>{timeLeft}s</span>
              </div>
              <div className="line-info">Línea {currentLine + 1}/14</div>
            </div>
          )}
          <FaceTrackerComponent videoEl={videoEl} idSesion={idSesion}></FaceTrackerComponent>
          <EmotionBarsComponent 
            videoEl={videoEl} 
            idSesion={idSesion} 
            testComplete={testComplete}
            showDuringResults={true}
          ></EmotionBarsComponent>
          <EngagementComponent 
            videoEl={videoEl} 
            idSesion={idSesion} 
            testComplete={testComplete}
            showDuringResults={true}
          ></EngagementComponent>
        </div>

      
    </div>
  );
};

export default D2AttentionTest;

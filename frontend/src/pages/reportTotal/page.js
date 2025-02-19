import React, { useState, useEffect } from 'react';
import { obtenerParticipantesPorNrc, obtenerParticipantesPorNrc1, obtenerParticipantesPorNrcInforme } from '../../api/repotTotal';
import NrcSelector from '../../components/NrcSelector';
import './reportTot.css';
import ReportTotalGrafico from './reporTot';

function ReportTotal() {
  const [nrc, setNrc] = useState('');
  const [participantes, setParticipantes] = useState([]);
  const [participantes1, setParticipantes1] = useState([]);
  const [participantesInforme, setParticipantesInforme] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (nrc) {
      const fetchParticipantes = async () => {
        try {
          const data = await obtenerParticipantesPorNrc(nrc);
          setParticipantes(data);
          const data1 = await obtenerParticipantesPorNrc1(nrc);
          setParticipantes1(data1);
          const dataInforme = await obtenerParticipantesPorNrcInforme(nrc);
          setParticipantesInforme(dataInforme);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchParticipantes();
    }
  }, [nrc]);

  return (
    <div className="report-total-container">
      <NrcSelector nrc={nrc} setNrc={setNrc} />
      {error && <p className="error-message">{error}</p>}
      <div className="report-content">
        <h2>Participantes por NRC</h2>
        <div className="report-section">
          <h3>Analisis Tiempo Real</h3>
          <table>
            <thead>
              <tr>
                <th>ID Analisis</th>
                <th>Activación</th>
                <th>Valencia</th>
                <th>Atención</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map((participante) => (
                <tr key={participante.id}>
                  <td>{participante.idAnalisis}</td>
                  <td>{participante.activacion}</td>
                  <td>{participante.valencia}</td>
                  <td>{participante.atencion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="report-section">
          <h3>Participantes Sesiones</h3>
          <table>
            <thead>
              <tr>
                <th>ID Participación</th>
                <th>Angry</th>
                <th>Disgust</th>
                <th>Fear</th>
                <th>Happy</th>
                <th>Sad</th>
                <th>Surprise</th>
                <th>Neutral</th>
              </tr>
            </thead>
            <tbody>
              {participantes1.map((participante) => (
                <tr key={participante.id}>
                  <td>{participante.idParticipacion}</td>
                  <td>{participante.angry}</td>
                  <td>{participante.disgust}</td>
                  <td>{participante.fear}</td>
                  <td>{participante.happy}</td>
                  <td>{participante.sad}</td>
                  <td>{participante.surprise}</td>
                  <td>{participante.neutral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="report-section">
          <h3>Informes</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Objetivos Totales</th>
                <th>Aciertos</th>
                <th>Errores Totales</th>
                <th>Efectividad Total</th>
                <th>Indice de Concentración</th>
                <th>Indice de Variación</th>
                <th>Velocidad de Trabajo</th>
                <th>Precisión</th>
              </tr>
            </thead>
            <tbody>
              {participantesInforme.map((participante) => (
                <tr key={participante.id}>
                  <td>{participante.id}</td>
                  <td>{participante.objetivosTotales}</td>
                  <td>{participante.aciertos}</td>
                  <td>{participante.erroresTotales}</td>
                  <td>{participante.efectividadTotal}</td>
                  <td>{participante.indiceConcentracion}</td>
                  <td>{participante.indiceVariacion}</td>
                  <td>{participante.velocidadTrabajo}</td>
                  <td>{participante.precision_info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReportTotalGrafico />
    </div>
  );
}

export default ReportTotal;
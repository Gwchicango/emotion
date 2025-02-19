import React, { useState, useEffect } from 'react';
import { obtenerParticipantesPorNrc, obtenerParticipantesPorNrc1, obtenerParticipantesPorNrcInforme } from '../../api/repotTotal';
import NrcSelector from '../../components/NrcSelector';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import './reportTotalGrafico.css';

function ReportTotalGrafico() {
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

  const calculateAverages = (data, keys) => {
    const averages = {};
    keys.forEach(key => {
      const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
      averages[key] = sum / data.length;
    });
    return averages;
  };

  const participantesAverages = calculateAverages(participantes, ['activacion', 'valencia', 'atencion']);
  const participantes1Averages = calculateAverages(participantes1, ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']);
  const participantesInformeAverages = calculateAverages(participantesInforme, ['objetivosTotales', 'aciertos', 'erroresTotales', 'velocidadTrabajo', 'efectividadTotal', 'indiceConcentracion', 'indiceVariacion', 'precision_info']);

  return (
    <div className="report-total-container">
      <NrcSelector nrc={nrc} setNrc={setNrc} />
      {error && <p className="error-message">{error}</p>}
      <div className="report-content">
        <h2>Participantes por NRC</h2>
        <div className="report-section">
          <h3>Analisis Tiempo Real</h3>
          <BarChart width={1000} height={500} data={[participantesAverages]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="idAnalisis" stroke="#333">
              <Label value="ID Analisis" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis stroke="#333">
              <Label value="Valores" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey="activacion" fill="#8884d8" />
            <Bar dataKey="valencia" fill="#82ca9d" />
            <Bar dataKey="atencion" fill="#ffc658" />
          </BarChart>
        </div>
        <div className="report-section">
          <h3>Emociones y Atención</h3>
          {['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'].map((emotion) => (
            <div key={emotion} className="emotion-section">
              <h4>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</h4>
              <div className="charts-container">
                <BarChart width={500} height={500} data={[participantes1Averages]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey={emotion} stroke="#333">
                    <Label value={emotion.charAt(0).toUpperCase() + emotion.slice(1)} offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis stroke="#333">
                    <Label value="Atención" angle={-90} position="insideLeft" />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={emotion} fill="#8884d8" />
                  <Bar dataKey="atencion" fill="#ff8042" />
                </BarChart>
              </div>
            </div>
          ))}
        </div>
        <div className="report-section">
          <h3>Informes</h3>
          <BarChart width={1000} height={500} data={[participantesInformeAverages]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="id" stroke="#333">
              <Label value="ID Informe" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis stroke="#333">
              <Label value="Valores" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey="objetivosTotales" fill="#8884d8" />
            <Bar dataKey="aciertos" fill="#82ca9d" />
            <Bar dataKey="erroresTotales" fill="#ffc658" />
            <Bar dataKey="velocidadTrabajo" fill="#ff8042" />
            <Bar dataKey="efectividadTotal" fill="#8a2be2" />
            <Bar dataKey="indiceConcentracion" fill="#ff6347" />
            <Bar dataKey="indiceVariacion" fill="#4682b4" />
            <Bar dataKey="precision_info" fill="#32cd32" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default ReportTotalGrafico;
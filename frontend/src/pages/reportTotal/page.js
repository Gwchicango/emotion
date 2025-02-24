import React, { useState, useEffect } from 'react';
import { obtenerDatosCombinados } from '../../api/repotTotal';
import './reportTot.css';

function ReportTotal() {
  const [datosCombinados, setDatosCombinados] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatosCombinados = async () => {
      try {
        const data = await obtenerDatosCombinados(); // Llama a la función directamente
        setDatosCombinados(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDatosCombinados(); // Llama a la función cuando el componente se monta
  }, []); // Sin dependencias, se ejecuta solo una vez al montar el componente

  const agruparDatosPorIdSeccion = (data) => {
    const agrupados = {};

    // Función para inicializar un grupo si no existe
    const inicializarGrupo = (idSeccion) => {
      if (!agrupados[idSeccion]) {
        agrupados[idSeccion] = {
          idSeccion,
          analisis: [],
          participaciones: [],
          informes: [],
        };
      }
    };

    // Agrupar datos de análisis
    if (Array.isArray(data.analisis)) {
      data.analisis.forEach(item => {
        if (item.idSeccion) {
          inicializarGrupo(item.idSeccion);
          agrupados[item.idSeccion].analisis.push(item);
        }
      });
    }

    // Agrupar datos de participaciones
    if (Array.isArray(data.participaciones)) {
      data.participaciones.forEach(item => {
        if (item.idSeccion) {
          inicializarGrupo(item.idSeccion);
          agrupados[item.idSeccion].participaciones.push(item);
        }
      });
    }

    // Agrupar datos de informes
    if (Array.isArray(data.informes)) {
      data.informes.forEach(item => {
        if (item.seccionTest && item.seccionTest.id) {
          inicializarGrupo(item.seccionTest.id);
          agrupados[item.seccionTest.id].informes.push(item);
        }
      });
    }

    return Object.values(agrupados);
  };

  const calcularPromedios = (grupo) => {
    const promedios = {
      activacion: 0,
      valencia: 0,
      atencion: 0,
      angry: 0,
      disgust: 0,
      fear: 0,
      happy: 0,
      sad: 0,
      surprise: 0,
      neutral: 0,
    };

    // Calcular promedios de análisis
    if (grupo.analisis.length > 0) {
      grupo.analisis.forEach(item => {
        promedios.activacion += parseFloat(item.activacion) || 0;
        promedios.valencia += parseFloat(item.valencia) || 0;
        promedios.atencion += parseFloat(item.atencion) || 0;
      });
      promedios.activacion /= grupo.analisis.length;
      promedios.valencia /= grupo.analisis.length;
      promedios.atencion /= grupo.analisis.length;
    }

    // Calcular promedios de participaciones
    if (grupo.participaciones.length > 0) {
      grupo.participaciones.forEach(item => {
        promedios.angry += parseFloat(item.angry) || 0;
        promedios.disgust += parseFloat(item.disgust) || 0;
        promedios.fear += parseFloat(item.fear) || 0;
        promedios.happy += parseFloat(item.happy) || 0;
        promedios.sad += parseFloat(item.sad) || 0;
        promedios.surprise += parseFloat(item.surprise) || 0;
        promedios.neutral += parseFloat(item.neutral) || 0;
      });
      promedios.angry /= grupo.participaciones.length;
      promedios.disgust /= grupo.participaciones.length;
      promedios.fear /= grupo.participaciones.length;
      promedios.happy /= grupo.participaciones.length;
      promedios.sad /= grupo.participaciones.length;
      promedios.surprise /= grupo.participaciones.length;
      promedios.neutral /= grupo.participaciones.length;
    }

    return promedios;
  };

  const datosAgrupados = datosCombinados ? agruparDatosPorIdSeccion(datosCombinados) : [];

  return (
    <div className="report-total-container">
      {error && <p className="error-message">{error}</p>}
      <div className="report-content">
        <h2>Participantes</h2>
        <table>
          <thead>
            <tr>
              <th>ID Sección</th>
              <th>Activación</th>
              <th>Valencia</th>
              <th>Atención</th>
              <th>Angry</th>
              <th>Disgust</th>
              <th>Fear</th>
              <th>Happy</th>
              <th>Sad</th>
              <th>Surprise</th>
              <th>Neutral</th>
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
            {datosAgrupados.map((grupo) => {
              const promedios = calcularPromedios(grupo);
              const informe = grupo.informes[0] || {}; // Tomar el primer informe (si existe)
              return (
                <tr key={grupo.idSeccion}>
                  <td>{grupo.idSeccion}</td>
                  <td>{promedios.activacion.toFixed(2)}</td>
                  <td>{promedios.valencia.toFixed(2)}</td>
                  <td>{promedios.atencion.toFixed(2)}</td>
                  <td>{promedios.angry.toFixed(2)}</td>
                  <td>{promedios.disgust.toFixed(2)}</td>
                  <td>{promedios.fear.toFixed(2)}</td>
                  <td>{promedios.happy.toFixed(2)}</td>
                  <td>{promedios.sad.toFixed(2)}</td>
                  <td>{promedios.surprise.toFixed(2)}</td>
                  <td>{promedios.neutral.toFixed(2)}</td>
                  <td>{informe.objetivosTotales || '-'}</td>
                  <td>{informe.aciertos || '-'}</td>
                  <td>{informe.erroresTotales || '-'}</td>
                  <td>{informe.efectividadTotal || '-'}</td>
                  <td>{informe.indiceConcentracion || '-'}</td>
                  <td>{informe.indiceVariacion || '-'}</td>
                  <td>{informe.velocidadTrabajo || '-'}</td>
                  <td>{informe.precision_info || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportTotal;
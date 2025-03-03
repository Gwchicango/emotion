import React, { useState, useEffect } from 'react';
import { obtenerDatosCombinados, obtenerDatosCombinadosNRC } from '../../api/repotTotal';
import NrcSelector from '../../components/NrcSelector'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos
import './reportTot.css';

function ReportTotal() {
  const [datosCombinados, setDatosCombinados] = useState(null);
  const [error, setError] = useState('');
  const [nrc, setNrc] = useState(''); // Estado para el NRC seleccionado

  useEffect(() => {
    const fetchDatosCombinados = async () => {
      try {
        let data;
        if (nrc) {
          data = await obtenerDatosCombinadosNRC(nrc); // Llama a la función con el NRC seleccionado
        } else {
          data = await obtenerDatosCombinados(); // Llama a la función directamente
        }
        setDatosCombinados(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDatosCombinados(); // Llama a la función cuando el componente se monta o cuando cambia el NRC
  }, [nrc]); // Dependencia en el NRC

  const agruparDatosPorIdSeccion = (data) => {
    const agrupados = {};

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

    if (Array.isArray(data.analisis)) {
      data.analisis.forEach(item => {
        if (item.idSeccion) {
          inicializarGrupo(item.idSeccion);
          agrupados[item.idSeccion].analisis.push(item);
        }
      });
    }

    if (Array.isArray(data.participaciones)) {
      data.participaciones.forEach(item => {
        if (item.idSeccion) {
          inicializarGrupo(item.idSeccion);
          agrupados[item.idSeccion].participaciones.push(item);
        }
      });
    }

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
  
    // Contadores para valores válidos (no cero)
    const contadores = {
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
        if (item.activacion !== 0) {
          promedios.activacion += parseFloat(item.activacion) || 0;
          contadores.activacion++;
        }
        if (item.valencia !== 0) {
          promedios.valencia += parseFloat(item.valencia) || 0;
          contadores.valencia++;
        }
        if (item.atencion !== 0) {
          promedios.atencion += parseFloat(item.atencion) || 0;
          contadores.atencion++;
        }
      });
  
      if (contadores.activacion > 0) {
        promedios.activacion /= contadores.activacion;
      }
      if (contadores.valencia > 0) {
        promedios.valencia /= contadores.valencia;
      }
      if (contadores.atencion > 0) {
        promedios.atencion /= contadores.atencion;
      }
    }
  
    // Calcular promedios de participaciones
    if (grupo.participaciones.length > 0) {
      grupo.participaciones.forEach(item => {
        if (item.angry !== 0) {
          promedios.angry += parseFloat(item.angry) || 0;
          contadores.angry++;
        }
        if (item.disgust !== 0) {
          promedios.disgust += parseFloat(item.disgust) || 0;
          contadores.disgust++;
        }
        if (item.fear !== 0) {
          promedios.fear += parseFloat(item.fear) || 0;
          contadores.fear++;
        }
        if (item.happy !== 0) {
          promedios.happy += parseFloat(item.happy) || 0;
          contadores.happy++;
        }
        if (item.sad !== 0) {
          promedios.sad += parseFloat(item.sad) || 0;
          contadores.sad++;
        }
        if (item.surprise !== 0) {
          promedios.surprise += parseFloat(item.surprise) || 0;
          contadores.surprise++;
        }
        if (item.neutral !== 0) {
          promedios.neutral += parseFloat(item.neutral) || 0;
          contadores.neutral++;
        }
      });
  
      if (contadores.angry > 0) {
        promedios.angry /= contadores.angry;
      }
      if (contadores.disgust > 0) {
        promedios.disgust /= contadores.disgust;
      }
      if (contadores.fear > 0) {
        promedios.fear /= contadores.fear;
      }
      if (contadores.happy > 0) {
        promedios.happy /= contadores.happy;
      }
      if (contadores.sad > 0) {
        promedios.sad /= contadores.sad;
      }
      if (contadores.surprise > 0) {
        promedios.surprise /= contadores.surprise;
      }
      if (contadores.neutral > 0) {
        promedios.neutral /= contadores.neutral;
      }
    }
  
    return promedios;
  };
  const datosAgrupados = datosCombinados ? agruparDatosPorIdSeccion(datosCombinados) : [];

  const descargarJSON = () => {
    const datosConPromedios = datosAgrupados.map((grupo) => {
      const promedios = calcularPromedios(grupo);
      const informe = grupo.informes[0] || {};

      return {
        idSeccion: grupo.idSeccion,
        ...promedios,
        objetivosTotales: informe.objetivosTotales || '-',
        aciertos: informe.aciertos || '-',
        erroresTotales: informe.erroresTotales || '-',
        efectividadTotal: informe.efectividadTotal || '-',
        indiceConcentracion: informe.indiceConcentracion || '-',
        indiceVariacion: informe.indiceVariacion || '-',
        velocidadTrabajo: informe.velocidadTrabajo || '-',
        precision_info: informe.precision_info || '-',
      };
    });

    const datosJSON = JSON.stringify(datosConPromedios, null, 2);
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_combinados.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-total-container">
      {error && <p className="error-message">{error}</p>}
      <NrcSelector nrc={nrc} setNrc={setNrc} />
      <div className="report-content">
        <h2>Participantes</h2>
        <button className="download-button" onClick={descargarJSON}>Descargar JSON</button>
        <table>
          <thead>
            <tr>
              <th>ID Test</th>
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
              const informe = grupo.informes[0] || {};
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
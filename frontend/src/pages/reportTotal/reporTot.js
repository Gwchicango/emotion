import React, { useState, useEffect } from 'react';
import { obtenerDatosCombinadosPorNrc } from '../../api/repotTotal';
import NrcSelector from '../../components/NrcSelector';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import './reportTotalGrafico.css';

function ReportTotalGrafico() {
  const [nrc, setNrc] = useState('');
  const [datosCombinados, setDatosCombinados] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (nrc) {
      const fetchDatosCombinados = async () => {
        try {
          const data = await obtenerDatosCombinadosPorNrc(nrc);
          setDatosCombinados(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchDatosCombinados();
    }
  }, [nrc]);

  const agruparDatosPorIdSeccion = (data) => {
    const agrupados = {};

    if (data.analisis) {
      data.analisis.forEach(item => {
        if (!agrupados[item.idSeccion]) {
          agrupados[item.idSeccion] = { idSeccion: item.idSeccion, analisis: [], participaciones: [], informes: [] };
        }
        agrupados[item.idSeccion].analisis.push(item);
      });
    }

    if (data.participaciones) {
      data.participaciones.forEach(item => {
        if (!agrupados[item.idSeccion]) {
          agrupados[item.idSeccion] = { idSeccion: item.idSeccion, analisis: [], participaciones: [], informes: [] };
        }
        agrupados[item.idSeccion].participaciones.push(item);
      });
    }

    if (data.informes) {
      data.informes.forEach(item => {
        if (!agrupados[item.seccionTest.idSeccion]) {
          agrupados[item.seccionTest.idSeccion] = { idSeccion: item.seccionTest.idSeccion, analisis: [], participaciones: [], informes: [] };
        }
        agrupados[item.seccionTest.idSeccion].informes.push(item);
      });
    }

    return Object.values(agrupados);
  };

  const datosAgrupados = datosCombinados ? agruparDatosPorIdSeccion(datosCombinados) : [];

  return (
    <div className="report-total-container">
      <NrcSelector nrc={nrc} setNrc={setNrc} />
      {error && <p className="error-message">{error}</p>}
      <div className="report-content">
        <h2>Participantes por NRC</h2>
        {datosAgrupados.map((grupo) => (
          <div key={grupo.idSeccion} className="report-section">
            <h3>Sección {grupo.idSeccion}</h3>
            <BarChart width={1000} height={500} data={[...grupo.analisis, ...grupo.participaciones, ...grupo.informes]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="idSeccion" stroke="#333">
                <Label value="ID Sección" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis stroke="#333">
                <Label value="Valores" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey="activacion" fill="#8884d8" />
              <Bar dataKey="valencia" fill="#82ca9d" />
              <Bar dataKey="atencion" fill="#ffc658" />
              <Bar dataKey="angry" fill="#ff0000" />
              <Bar dataKey="disgust" fill="#00ff00" />
              <Bar dataKey="fear" fill="#0000ff" />
              <Bar dataKey="happy" fill="#ffff00" />
              <Bar dataKey="sad" fill="#000080" />
              <Bar dataKey="surprise" fill="#ff00ff" />
              <Bar dataKey="neutral" fill="#808080" />
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
        ))}
      </div>
    </div>
  );
}

export default ReportTotalGrafico;
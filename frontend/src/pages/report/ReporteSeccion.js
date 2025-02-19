import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerResultadoPorSeccionId, obtenerResultadoPorSeccionParticipanteSId } from '../../api/serverApi';
import { ObtenerInformeForIDSeccion } from '../../api/resultsApi';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './report.css'; // Importa el archivo CSS

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const ReporteSeccion = () => {
  const { idSeccion } = useParams(); // Obtén el idSeccion de los parámetros de la URL
  const [reporte, setReporte] = useState([]);
  const [otroReporte, setOtroReporte] = useState([]); // Estado para el otro reporte
  const [informe, setInforme] = useState(null); // Estado para el informe
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(); // Referencia al contenedor del reporte

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const data = await obtenerResultadoPorSeccionId(idSeccion);
        setReporte(data || []);
        const otroData = await obtenerResultadoPorSeccionParticipanteSId(idSeccion);
        setOtroReporte(otroData || []);
        const informeData = await ObtenerInformeForIDSeccion(idSeccion);
        setInforme(informeData[0] || null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, [idSeccion]);

  const handleDownloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 40; // Ajusta el ancho de la imagen para dejar márgenes
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      let heightLeft = imgHeight;
      let position = 20; // Margen superior

      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 40; // Ajusta la altura restante para dejar márgenes

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 20; // Margen superior
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 40; // Ajusta la altura restante para dejar márgenes
      }

      // Obtener la fecha actual
      const date = new Date();
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      // Obtener datos únicos del usuario (por ejemplo, ID de la sección y ID del análisis)
      const uniqueData = `${idSeccion}_${reporte[0]?.idAnalisis || 'unknown'}`;

      // Guardar el PDF con el nombre combinado
      pdf.save(`reporte_${uniqueData}_${dateString}.pdf`);
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const data = {
    labels: Array.isArray(reporte) ? reporte.map((analisis) => `Análisis ${analisis.idAnalisis}`) : [],
    datasets: [
      {
        label: 'Activación',
        data: Array.isArray(reporte) ? reporte.map((analisis) => analisis.activacion) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Valencia',
        data: Array.isArray(reporte) ? reporte.map((analisis) => analisis.valencia) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
      {
        label: 'Atención',
        data: Array.isArray(reporte) ? reporte.map((analisis) => analisis.atencion) : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      },
    ],
  };

  const otroData = {
    labels: Array.isArray(otroReporte) ? otroReporte.map((participacion) => `Participación ${participacion.idParticipacion}`) : [],
    datasets: [
      {
        label: 'Angry',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.angry) : [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Disgust',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.disgust) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Fear',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.fear) : [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
      },
      {
        label: 'Happy',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.happy) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Sad',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.sad) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
      {
        label: 'Surprise',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.surprise) : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      },
      {
        label: 'Neutral',
        data: Array.isArray(otroReporte) ? otroReporte.map((participacion) => participacion.neutral) : [],
        borderColor: 'rgba(201, 203, 207, 1)',
        backgroundColor: 'rgba(201, 203, 207, 0.2)',
        fill: true,
      },
    ],
  };

  const informeData = {
    labels: ['Objetivos Totales', 'Aciertos', 'Errores por Omisión', 'Errores por Comisión', 'Errores Letras', 'Errores Rayita', 'Errores Dobles', 'Errores Totales', 'Efectividad Total', 'Índice de Concentración', 'Índice de Variación', 'Velocidad de Trabajo', 'Precisión'],
    datasets: [
      {
        label: 'Informe de la Sección',
        data: informe ? [
          informe.objetivosTotales,
          informe.aciertos,
          informe.erroresPorOmision,
          informe.erroresPorComision,
          informe.erroresLetras,
          informe.erroresRayita,
          informe.erroresDobles,
          informe.erroresTotales,
          informe.efectividadTotal,
          informe.indiceConcentracion,
          informe.indiceVariacion,
          informe.velocidadTrabajo,
          informe.precision_info
        ] : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar el tamaño de la gráfica
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12, // Tamaño de fuente más pequeño para la leyenda
          },
        },
      },
      title: {
        display: true,
        text: `Gráfica de Análisis de la Sección ${idSeccion}`,
        font: {
          size: 16, // Tamaño de fuente más pequeño para el título
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.raw;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10, // Tamaño de fuente más pequeño para las etiquetas del eje x
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10, // Tamaño de fuente más pequeño para las etiquetas del eje y
          },
        },
      },
    },
  };

  const attentionAnalysisData = {
    labels: ['Aciertos', 'Errores por Omisión', 'Errores por Comisión', 'Errores Totales', 'Efectividad Total', 'Índice de Concentración', 'Índice de Variación', 'Velocidad de Trabajo', 'Precisión'],
    datasets: [
      {
        label: 'Atención',
        data: informe ? [
          informe.aciertos,
          informe.erroresPorOmision,
          informe.erroresPorComision,
          informe.erroresTotales,
          informe.efectividadTotal,
          informe.indiceConcentracion,
          informe.indiceVariacion,
          informe.velocidadTrabajo,
          informe.precision_info
        ] : [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const emotionVsAttentionData = {
    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'],
    datasets: [
      {
        label: 'Emociones',
        data: Array.isArray(otroReporte) ? [
          otroReporte.reduce((sum, p) => sum + p.angry, 0) / otroReporte.length,
          otroReporte.reduce((sum, p) => sum + p.disgust, 0) / otroReporte.length,
          otroReporte.reduce((sum, p) => sum + p.fear, 0) / otroReporte.length,
          otroReporte.reduce((sum, p) => sum + p.happy, 0) / otroReporte.length,
          otroReporte.reduce((sum, p) => sum + p.sad, 0) / otroReporte.length,
          otroReporte.reduce((sum, p) => sum + p.surprise, 0) / otroReporte.length,
          otroReporte.reduce((sum, p) => sum + p.neutral, 0) / otroReporte.length,
        ] : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Atención',
        data: informe ? [
          informe.aciertos,
          informe.erroresPorOmision,
          informe.erroresPorComision,
          informe.erroresTotales,
          informe.efectividadTotal,
          informe.indiceConcentracion,
          informe.indiceVariacion,
          informe.velocidadTrabajo,
          informe.precision_info
        ] : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="report-page">
      {Array.isArray(reporte) && reporte.length > 0 ? (
        <div className="report-container" ref={reportRef}>
          <div className="report-header">
            <h2>Reporte de la Sección {idSeccion}</h2>
          </div>
          <div className="report-details">
            <table className="report-table">
              <thead>
                <tr>
                  <th>ID Análisis</th>
                  <th>ID Sección</th>
                  <th>Activación</th>
                  <th>Valencia</th>
                  <th>Atención</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {reporte.map((analisis) => (
                  <tr key={analisis.id}>
                    <td>{analisis.idAnalisis}</td>
                    <td>{analisis.idSeccion}</td>
                    <td>{analisis.activacion}</td>
                    <td>{analisis.valencia}</td>
                    <td>{analisis.atencion}</td>
                    <td>
                      {analisis.activacion > 20 ? 'Alta activación' : 'Baja activación'}, 
                      {analisis.valencia > 20 ? ' Positiva' : ' Negativa'}, 
                      {analisis.atencion > 20 ? ' Alta atención' : ' Baja atención'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="report-chart">
            <div style={{ height: '400px' }}>
              <Line data={data} options={options} />
            </div>
          </div>
          <div className="report-details">
            <h3>Reporte de Emociones del Participante</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>ID Participación</th>
                  <th>ID Sección</th>
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
                {Array.isArray(otroReporte) && otroReporte.map((participacion) => (
                  <tr key={participacion.id}>
                    <td>{participacion.idParticipacion}</td>
                    <td>{participacion.idSeccion}</td>
                    <td>{participacion.angry}</td>
                    <td>{participacion.disgust}</td>
                    <td>{participacion.fear}</td>
                    <td>{participacion.happy}</td>
                    <td>{participacion.sad}</td>
                    <td>{participacion.surprise}</td>
                    <td>{participacion.neutral}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="report-chart">
            <div style={{ height: '400px' }}>
              <Line data={otroData} options={options} />
            </div>
          </div>
          {informe && (
            <div className="report-chart">
              <h3>Reporte del Test D2-R</h3>
              <div style={{ height: '400px' }}>
                <Line data={informeData} options={options} />
              </div>
            </div>
          )}
          {informe && (
            <div className="report-chart">
              <h3>Análisis de Atención</h3>
              <div style={{ height: '400px' }}>
                <Bar data={attentionAnalysisData} options={options} />
              </div>
            </div>
          )}
          {informe && (
            <div className="report-chart">
              <h3>Emociones vs Atención</h3>
              <div style={{ height: '400px' }}>
                <Bar data={emotionVsAttentionData} options={options} />
              </div>
            </div>
          )}
          <button onClick={handleDownloadPDF} className="download-button">Descargar PDF</button>
        </div>
      ) : (
        <div className="report-container">
          No se encontró el reporte para la sección con ID {idSeccion}
        </div>
      )}
    </div>
  );
};

export default ReporteSeccion;
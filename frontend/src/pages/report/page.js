import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerPersonaPorId } from '../../api/reportsApi';
import { obtenerSecciones } from '../../api/seccionTestApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import './report.css'; // Importa el archivo CSS

const DetallesPersona = () => {
  const [persona, setPersona] = useState(null);
  const [secciones, setSecciones] = useState([]); // Inicializa con un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null); // Define el estado para el ID
  const navigate = useNavigate(); // Hook de react-router-dom para manejar la navegación

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const id = sessionStorage.getItem('idInterno'); // Obtén el id del sessionStorage
        if (!id) {
          throw new Error('ID no encontrado');
        }
        setId(id); // Guarda el ID en el estado
        const data = await obtenerPersonaPorId(id);
        let seccionesData = await obtenerSecciones(id);

        // Ordena las secciones por ID en orden descendente
        seccionesData = seccionesData.sort((a, b) => b.id - a.id);

        setSecciones(seccionesData);
        setPersona(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, []);

  const handleBackClick = () => {
    navigate(-1); // Navega a la página anterior
  };

  const handleViewReportClick = (idSeccion) => {
    navigate(`/reporte/${idSeccion}`); // Navega a la página del reporte de la sesión del test
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="report-page">
      {persona ? (
        <div className="report-container">
          <div className="report-header">
            <h2>Detalles de la Persona</h2>
          </div>
          <div className="report-details">
            <p><span>ID:</span> {persona.id}</p>
            <p><span>Nombre:</span> {persona.nombre}</p>
            <p><span>Username:</span> {persona.username}</p>
            <p><span>Email:</span> {persona.email}</p>
            <p><span>Género:</span> {persona.genero}</p>
            <p><span>Fecha de Nacimiento:</span> {persona.fechaNacimiento}</p>
          </div>
          <div className="report-sections">
            <h3>Resultados de Tests</h3>
            {secciones.length > 0 ? (
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID Sección</th>
                      <th>Fecha de Inicio</th>
                      <th>Fecha de Fin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secciones.map((seccion) => (
                      <tr key={seccion.id}>
                        <td>{seccion.id}</td>
                        <td>{seccion.fechaHoraInicio}</td>
                        <td>{seccion.fechaHoraFin}</td>
                        <td>
                          <button onClick={() => handleViewReportClick(seccion.id)} className="view-button">
                            <FontAwesomeIcon icon={faEye} /> Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No se encontraron secciones para este usuario.</p>
            )}
          </div>
          <button onClick={handleBackClick} className="back-button">Regresar</button>
        </div>
      ) : (
        <div className="report-container">
          No se encontraron detalles para la persona con ID {id}
          <button onClick={handleBackClick} className="back-button">Regresar</button>
        </div>
      )}
    </div>
  );
};

export default DetallesPersona;
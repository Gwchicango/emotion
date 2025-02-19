import React, { useEffect, useState } from 'react';
import './componentCSS/results.css';
import { crearInforme } from '../api/resultsApi';

const TestResults = ({ results }) => {
  const [informeCreado, setInformeCreado] = useState(false);

  useEffect(() => {
    if (results && results.idSesion && !informeCreado) {
      console.log("ID Sección 2:", results.idSesion);

      // Crear el objeto informe basado en los resultados
      const informe = {
        objetivosTotales: parseFloat(results.total),
        aciertos: parseFloat(results.correct),
        erroresPorOmision: parseFloat(results.omissions),
        erroresPorComision: parseFloat(results.commissions),
        erroresLetras: parseFloat(results.errorsCommissions?.letras ?? 0),
        erroresRayita: parseFloat(results.errorsCommissions?.rayitas ?? 0),
        erroresDobles: parseFloat(results.errorsCommissions?.dobles ?? 0),
        erroresTotales: parseFloat(results.totalErrors),
        efectividadTotal: parseFloat(results.effectivenessTotal),
        indiceConcentracion: parseFloat(results.concentrationIndex) * 100,
        indiceVariacion: parseFloat(results.variationIndex),
        velocidadTrabajo: parseFloat(results.workSpeed) * 100,
        precision_info: parseFloat(results.precision),
        fechaCreacion: new Date().toISOString(), // Fecha de creación actual
        seccionTest: { id: results.idSesion } // Agregar el ID de la sección
      };

      // Llamar a la función crearInforme para guardar los datos
      crearInforme(informe)
        .then(response => {
          console.log('Informe creado exitosamente:', response);
          setInformeCreado(true);
        })
        .catch(error => {
          console.error('Error al crear el informe:', error);
        });
    } else {
      console.log("No hay resultados o ID de sección");
    }
  }, [results, informeCreado]);

  return (
    <div className="results">
      <h3>Resultados del Test:</h3>
      <div className="results-grid">
        <div className="result">
          <div className="label">Objetivos totales</div>
          <div className="value">{results.total}</div>
        </div>
        <div className="result">
          <div className="label">Aciertos (A)</div>
          <div className="value correct">{results.correct}</div>
        </div>
        <div className="result">
          <div className="label">Errores por omisión (EO)</div>
          <div className="value omissions">
            {results.omissions}{results.omissions > 0 ? ` (${(results.omissions * 100 / results.total).toFixed(2)}%)` : ''}
          </div>
          <div className="details">
            [ EO = Objetivos totales - Aciertos = {results.total} - {results.correct} = {results.omissions} ]
          </div>
        </div>
        <div className="result">
          <div className="label">Errores por comisión (EC)</div>
          <div className="value commissions">
            {results.commissions}{results.commissions > 0 ? ` (${(results.commissions * 100 / results.total).toFixed(2)}%)` : ''}
          </div>
          <div className="details">
            [ EC = Errores de rayitas + Errores de letras + Errores dobles = {results.errorsCommissions.rayitas} + {results.errorsCommissions.letras} + {results.errorsCommissions.dobles} = {results.commissions} ]
          </div>
        </div>
        <div className="result">
          <div className="label">Errores de rayitas</div>
          <div className="value commissions-rayitas">
            {results.errorsCommissions?.rayitas ?? 0}
          </div>
        </div>
        <div className="result">
          <div className="label">Errores de letras</div>
          <div className="value commissions-letras">
            {results.errorsCommissions?.letras ?? 0}
          </div>
        </div>
        <div className="result">
          <div className="label">Errores dobles</div>
          <div className="value commissions-dobles">
            {results.errorsCommissions?.dobles ?? 0}
          </div>
        </div>
        <div className="result">
          <div className="label">Errores Totales</div>
          <div className="value total-errors">
            {results.totalErrors}
          </div>
          <div className="details">
            [ Errores Totales = Errores por omisión + Errores por comisión = {results.omissions} + {results.commissions} = {results.totalErrors} ]
          </div>
        </div>
        <div className="result">
          <div className="label">Efectividad Total (TOT)</div>
          <div className="value effectiveness-total">
            {results.effectivenessTotal}%
          </div>
          <div className="details">
            [ TOT = ( Aciertos / Tiempo total ) × 100 = ( {results.correct} / {results.totalTime} ) × 100 = {results.effectivenessTotal}% ]
          </div>
        </div>
        <div className="result">
          <div className="label">Índice de Concentración (CON)</div>
          <div className="value concentration-index">
            {results.concentrationIndex}
          </div>
          <div className="details">
            [ CON = Aciertos / ( Aciertos + Errores por comisión ) = {results.correct} / ( {results.correct} + {results.commissions} ) = {results.concentrationIndex} ]
          </div>
        </div>
        <div className="result">
          <div className="label">Velocidad de Trabajo (VT)</div>
          <div className="value work-speed">
            {results.workSpeed}
          </div>
          <div className="details">
            [ VT = Aciertos / Tiempo total = {results.correct} / {results.totalTime} = {results.workSpeed} ]
          </div>
        </div>
        <div className="result">
          <div className="label">Precisión (E %)</div>
          <div className="value precision">
            {results.precision}%
          </div>
          <div className="details">
            [ E% = ( Aciertos / Total de respuestas ) × 100 = ( {results.correct} / {results.totalResponses} ) × 100 = {results.precision}% ]
          </div>
        </div>
        <div className="result">
          <div className="label">Índice de Variación (VAR)</div>
          <div className="value variation-index">
            {results.variationIndex}%
          </div>
          <div className="details">
            [ VAR = ( Errores / Aciertos ) × 100 = ( {results.totalErrors} / {results.correct} ) × 100 = {results.variationIndex}% ]
          </div>
        </div>
      </div>
      
      <h4>Resultados por bloque:</h4>
      <div className="block-results">
        {results.blocks.map(block => (
          <div key={block.block} className="block-result">
            <h5>Bloque {block.block}</h5>
            <p>Objetivos: {block.targets}</p>
            <p>Correctas: {block.correct}</p>
            <p>Incorrectas: {block.incorrect}</p>
            <p>Precisión: {block.accuracy}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
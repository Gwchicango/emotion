import React from 'react';

function NrcSelector({ nrc, setNrc }) {
  return (
    <div className="nrc-selector">
      <label htmlFor="nrc">Selecciona NRC:</label>
      <select id="nrc" value={nrc} onChange={(e) => setNrc(e.target.value)}>
        <option value="">Selecciona tu NRC</option>
        <option value="1111">1111</option>
        <option value="NRC2">NRC2</option>
        <option value="NRC3">NRC3</option>
      </select>
    </div>
  );
}

export default NrcSelector;
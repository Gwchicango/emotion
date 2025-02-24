import React from 'react';

function NrcSelector({ nrc, setNrc }) {
  return (
    <div className="nrc-selector">
      <label htmlFor="nrc">Selecciona NRC:</label>
      <select id="nrc" value={nrc} onChange={(e) => setNrc(e.target.value)}>
        <option value="">Selecciona tu NRC</option>
        <option value="3387">3387</option>
              <option value="3391">3391</option>
              <option value="3393">3393</option>
              <option value="1946">1946</option>
              <option value="1947">1947</option>
              <option value="1948">1948</option>
              <option value="1949">1949</option>
              <option value="IASA">IASA</option>
      </select>
    </div>
  );
}

export default NrcSelector;
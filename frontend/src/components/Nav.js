import React from 'react';
import { Link } from 'react-router-dom';
import './componentCSS/Nav.css';

function Nav() {
  return (
    <nav className="App-nav">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/attention-test">Test Atención</Link></li>
        <li><Link to="/report">Reportes</Link></li>
        <li><Link to="/reportTotal">Reportes NRC</Link></li>
      </ul>
    </nav>
  );
}

export default Nav;
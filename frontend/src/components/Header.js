import React from 'react';
import { useNavigate } from 'react-router-dom';
import './componentCSS/Header.css';

function Header({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar el estado de autenticación
    setIsAuthenticated(false);
    // Limpiar el sessionStorage
    sessionStorage.clear();
    // Redirigir a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <header className="App-header">
      <h1 className="app-title">Plataforma Educativa de Análisis</h1>
      <button className="logout-button" onClick={handleLogout}>Salir</button>
    </header>
  );
}

export default Header;
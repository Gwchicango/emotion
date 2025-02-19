import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Page from './pages/dashboard/page'; // Asegúrate de que el nombre del archivo coincida
import Login from './auth/login/login';
import Register from './auth/register/register';
import AttentionTest from './pages/testAtencion/page';
import ReporteSeccion from './pages/report/ReporteSeccion'; // Importar el componente ReporteSeccion
import Report from './pages/report/page';
import Header from './components/Header'; // Importar el componente Header
import Nav from './components/Nav'; // Importar el componente Nav
import ReportTotal from './pages/reportTotal/page';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    // Verificar si idInterno existe en sessionStorage al cargar la página
    const idInterno = sessionStorage.getItem('idInterno');
    if (idInterno) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Finalizar la carga
  }, []);

  useEffect(() => {
    // Verificar la sesión cada segundo
    const intervalId = setInterval(() => {
      const idInterno = sessionStorage.getItem('idInterno');
      if (!idInterno) {
        setIsAuthenticated(false);
      }
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Mostrar un indicador de carga mientras se verifica la autenticación
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />} {/* Mostrar Header solo si está autenticado */}
        {isAuthenticated && <Nav />} {/* Mostrar Nav solo si está autenticado */}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={isAuthenticated ? <Page /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Page /> : <Navigate to="/login" />}
          />
          <Route
            path="/attention-test"
            element={isAuthenticated ? <AttentionTest /> : <Navigate to="/login" />}
          />
          <Route
            path="/report"
            element={isAuthenticated ? <Report /> : <Navigate to="/login" />}
          />
          <Route 
            path="/reporte/:idSeccion" 
            element={ isAuthenticated ? <ReporteSeccion /> : <Navigate to="/login" />}
           />
           <Route
            path="/reportTotal"
            element={isAuthenticated ? <ReportTotal /> : <Navigate to="/login" />}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
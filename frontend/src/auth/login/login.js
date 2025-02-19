import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/loginApi';
import './login.css';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Estado para el mensaje
  const [messageType, setMessageType] = useState(''); // Estado para el tipo de mensaje (éxito o error)
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el estado de carga
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!username || !password) {
      setMessage('Todos los campos son obligatorios');
      setMessageType('error');
      return;
    }

    setIsLoading(true); // Mostrar el indicador de carga

    try {
      const userData = await loginUser(username, password);
      sessionStorage.setItem('idInterno', userData.idInterno); // Guardar el ID interno del usuario en el sessionStorage
      sessionStorage.setItem('idRol', userData.idRol); // Guardar el ID del rol del usuario en el sessionStorage
      sessionStorage.setItem('nrc', userData.nrc); // Guardar el nombre de usuario en el sessionStorage

      setIsAuthenticated(true);
      setMessage('Inicio de sesión exitoso');
      setMessageType('success');
      setTimeout(() => {
        navigate('/attention-test'); // Redirigir a la página principal después del login exitoso
      }, 2000); // Esperar 2 segundos antes de redirigir
    } catch (error) {
      setMessage('Error al iniciar sesión: ' + error.message);
      setMessageType('error');
      setIsLoading(false); // Ocultar el indicador de carga en caso de error
    }
  };

  return (
    <div className="login-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {!isLoading && (
        <div className="login-box">
          <h1>Iniciar Sesión</h1>
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Usuario:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Iniciar Sesión</button>
          </form>
          <div className="login-links">
            <a href="/register" className="register-link">Regístrate</a>
            <a href="/forgot-password" className="forgot-password-link">Recuperar contraseña</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/serverApi';
import './register.css';

function Register() {
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [nrc, setNrc] = useState(''); // Nuevo estado para nrc
  const [message, setMessage] = useState(''); // Estado para el mensaje
  const [messageType, setMessageType] = useState(''); // Estado para el tipo de mensaje (éxito o error)
  const navigate = useNavigate();

  const handleNombreChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNombre(value);
    } else {
      setMessage('El nombre no puede contener números');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!nombre || !username || !email || !password || !confirmPassword || !fechaNacimiento || !genero || !nrc) {
      setMessage('Todos los campos son obligatorios');
      setMessageType('error');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setMessageType('error');
      return;
    }

    const userData = {
      nombre: nombre,
      username: username,
      email: email,
      contraseña: password,
      fechaNacimiento: fechaNacimiento,
      genero: genero,
      nrc: nrc, // Añadir nrc a los datos del usuario
      rol: { id: 1 } // Asumiendo que el rol con id 1 es el rol de usuario
    };

    try {
      await registerUser(userData);
      setMessage('Registro exitoso');
      setMessageType('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirigir después de 2 segundos
    } catch (error) {
      setMessage('Error al registrar el usuario');
      setMessageType('error');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Regístrate</h1>
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group half-width">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={handleNombreChange}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Usuario:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>
          <div className="form-group half-width">
            <label>Género:</label>
            <select
              name="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            >
              <option value="">Selecciona tu género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="form-group half-width">
            <label>NRC:</label>
            <select
              name="nrc"
              value={nrc}
              onChange={(e) => setNrc(e.target.value)}
              required
            >
              <option value="">Selecciona tu NRC</option>
              <option value="1111">1111</option>
              <option value="NRC2">NRC2</option>
              <option value="NRC3">NRC3</option>
            </select>
          </div>
          <button type="submit" className="register-button">Regístrate</button>
        </form>
        <div className="register-links">
          <a href="/login" className="login-link">Iniciar Sesión</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export const loginUser = async (username, contraseña) => {
  const endpoint = '/api/personas/login';
  const API_URL = `${BASE_API_URL}${endpoint}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: username,
        contraseña: contraseña,
      }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    return await response.json(); // Esperamos un JSON como respuesta
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};
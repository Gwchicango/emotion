const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const API_URL = `${BASE_API_URL}/api`;

export const saveEmotionData = async (emotionData) => {
  try {
    const response = await fetch(`${API_URL}/participantessesiones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emotionData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar datos al servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos al servidor:', error);
    throw error;
  }
};

export const obtenerResultadoPorSeccionParticipanteSId = async (idSeccion) => {
  try {
    const response = await fetch(`${API_URL}/participantessesiones/result/${idSeccion}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el resultado para la sección con ID ${idSeccion}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(`Error al obtener el resultado para la sección con ID ${idSeccion}:`, error);
    throw error;
  }
};

export const saveAttentionData = async (attentionData) => {
  try {
    const response = await fetch(`${API_URL}/participantessesiones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attentionData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar datos al servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos al servidor:', error);
    throw error;
  }
};

export const saveAnalisisAtention = async (analisisAtentionData) => {
  try {
    const response = await fetch(`${API_URL}/analisis-tiempo-real`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analisisAtentionData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar datos al servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos al servidor:', error);
    throw error;
  }
};

export const obtenerResultadoPorSeccionId = async (idSeccion) => {
  try {
    const response = await fetch(`${API_URL}/analisis-tiempo-real/result/${idSeccion}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el resultado para la sección con ID ${idSeccion}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(`Error al obtener el resultado para la sección con ID ${idSeccion}:`, error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
};
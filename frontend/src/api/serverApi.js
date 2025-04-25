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

/*// Array para acumular las emociones
let emotionBatch = [];
const BATCH_SIZE = 10; // Enviar cada 10 emociones
const BATCH_TIMEOUT = 30000; // O enviar después de 30 segundos (lo que ocurra primero)
let batchTimeout = null;

export const saveEmotionData = async (emotionData) => {
  // Agregar la nueva emoción al batch
  emotionBatch.push(emotionData);
  
  // Verificar si debemos enviar
  if (emotionBatch.length >= BATCH_SIZE) {
    return sendBatch();
  }
  
  // Configurar timeout si es el primer elemento del batch
  if (emotionBatch.length === 1) {
    batchTimeout = setTimeout(() => {
      sendBatch();
    }, BATCH_TIMEOUT);
  }
};

// Función para enviar el batch acumulado
const sendBatch = async () => {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
  
  if (emotionBatch.length === 0) return;
  
  // Copiar el batch actual y limpiar
  const batchToSend = [...emotionBatch];
  emotionBatch = [];
  
  try {
    const response = await fetch(`${API_URL}/participantessesiones/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotions: batchToSend }),
    });

    if (!response.ok) {
      // Si falla, volver a poner los datos en el batch (excepto si es error del servidor)
      emotionBatch.unshift(...batchToSend);
      throw new Error('Error al enviar datos al servidor');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar datos al servidor:', error);
    throw error;
  }
};*/

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
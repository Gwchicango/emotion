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

/*let emotionDataArray = []; // Aquí se acumulan todas las emociones durante 5 minutos

// Función para agregar una nueva lectura de emociones
export const addEmotionData = (newEmotionData) => {
  emotionDataArray.push(newEmotionData);
};

// Función para calcular el promedio de las emociones
const calculateEmotionAverages = () => {
  const total = {
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0
  };

  emotionDataArray.forEach(data => {
    total.angry += data.angry;
    total.disgust += data.disgust;
    total.fear += data.fear;
    total.happy += data.happy;
    total.sad += data.sad;
    total.surprise += data.surprise;
    total.neutral += data.neutral;
  });

  const count = emotionDataArray.length;

  // Calculamos el promedio
  const averages = {
    angry: total.angry / count,
    disgust: total.disgust / count,
    fear: total.fear / count,
    happy: total.happy / count,
    sad: total.sad / count,
    surprise: total.surprise / count,
    neutral: total.neutral / count
  };

  return averages;
};

// Función para enviar el promedio de emociones al servidor
export const sendEmotionAverages = async () => {
  if (emotionDataArray.length === 0) {
    console.warn('No hay datos de emociones para enviar.');
    return;
  }

  const averages = calculateEmotionAverages();
  try {
    await saveEmotionData(averages);
    console.log('Promedio de emociones enviado exitosamente.');
  } catch (error) {
    console.error('Error al enviar promedio de emociones:', error);
  } finally {
    // Limpiamos el array para el siguiente periodo
    emotionDataArray = [];
  }
};

*/

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
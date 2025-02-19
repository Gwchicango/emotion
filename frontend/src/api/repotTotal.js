const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const API_URL = `${BASE_API_URL}/api`;

export const obtenerParticipantesPorNrc = async (nrc) => {
  try {
    const response = await fetch(`${API_URL}/analisis-tiempo-real/nrc/${nrc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los participantes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los participantes:', error);
    throw error;
  }
}

export const obtenerParticipantesPorNrc1 = async (nrc) => {
  try {
    const response = await fetch(`${API_URL}/participantessesiones/nrc/${nrc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los participantes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los participantes:', error);
    throw error;
  }
}

export const obtenerParticipantesPorNrcInforme = async (nrc) => {
  try {
    const response = await fetch(`${API_URL}/informes/nrc/${nrc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los participantes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los participantes:', error);
    throw error;
  }
}
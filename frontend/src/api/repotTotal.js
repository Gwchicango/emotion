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

export const obtenerDatosCombinados = async () => {
  try {
    const [analisis, participaciones, informes] = await Promise.all([
      fetch(`${API_URL}/analisis-tiempo-real`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json()),
      fetch(`${API_URL}/participantessesiones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json()),
      fetch(`${API_URL}/informes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json())
    ]);

    return {
      analisis,
      participaciones,
      informes
    };
  } catch (error) {
    console.error('Error al obtener los datos combinados:', error);
    throw error;
  }
}

export const obtenerDatosCombinadosNRC = async (nrc) => {
  try {
    const [analisis, participaciones, informes] = await Promise.all([
      fetch(`${API_URL}/analisis-tiempo-real/nrc/${nrc}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json()),
      fetch(`${API_URL}/participantessesiones/nrc/${nrc}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json()),
      fetch(`${API_URL}/informes/nrc/${nrc}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json())
    ]);

    return {
      analisis,
      participaciones,
      informes
    };
  } catch (error) {
    console.error('Error al obtener los datos combinados:', error);
    throw error;
  }
}
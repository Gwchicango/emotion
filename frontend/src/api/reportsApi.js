const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const API_URL = `${BASE_API_URL}/api/personas`;

// Obtener una persona por su ID
export const obtenerPersonaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('Persona Response:', responseText); // Log the persona response

    if (!response.ok) {
      throw new Error(`Error al obtener la persona con ID ${id}: ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Error al obtener la persona con ID ${id}:`, error);
    throw error;
  }
};
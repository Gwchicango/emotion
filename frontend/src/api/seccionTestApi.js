const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const API_URL = `${BASE_API_URL}/api/secciones`;

// Crear una nueva sección
export const crearSeccion = async (seccionTest) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seccionTest),
    });

    if (!response.ok) {
      throw new Error('Error al crear la sección');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear la sección:', error);
    throw error;
  }
};

// Obtener secciones por ID de usuario
export const obtenerSecciones = async (idUsuario) => {
  try {
    const response = await fetch(`${API_URL}/test/${idUsuario}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las secciones para el usuario con ID ${idUsuario}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(`Error al obtener las secciones para el usuario con ID ${idUsuario}:`, error);
    throw error;
  }
};

// Obtener una sección por su ID
export const obtenerSeccionPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la sección con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener la sección con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una sección por su ID
export const eliminarSeccion = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar la sección con ID ${id}`);
    }
  } catch (error) {
    console.error(`Error al eliminar la sección con ID ${id}:`, error);
    throw error;
  }
};

// Modificar una sección
export const modificarSeccion = async (id, seccionModificada) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seccionModificada),
    });

    if (!response.ok) {
      throw new Error(`Error al modificar la sección con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al modificar la sección con ID ${id}:`, error);
    throw error;
  }
};
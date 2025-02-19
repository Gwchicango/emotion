const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const API_URL = `${BASE_API_URL}/api/informes`;

// Crear un nuevo informe
export const crearInforme = async (informe) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(informe),
    });

    if (!response.ok) {
      throw new Error('Error al crear el informe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear el informe:', error);
    throw error;
  }
};

// Obtener todos los informes
export const obtenerTodosLosInformes = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los informes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener los informes:', error);
    throw error;
  }
};

// Obtener un informe por su ID
export const obtenerInformePorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el informe con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el informe con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un informe por su ID
export const eliminarInforme = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el informe con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el informe con ID ${id}:`, error);
    throw error;
  }
};

// Modificar un informe
export const modificarInforme = async (id, informeModificado) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(informeModificado),
    });

    if (!response.ok) {
      throw new Error(`Error al modificar el informe con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al modificar el informe con ID ${id}:`, error);
    throw error;
  }
};

export const ObtenerInformeForIDSeccion = async (idSeccion) => {
  try {
    const response = await fetch(`${API_URL}/seccion/${idSeccion}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el informe con ID ${idSeccion}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener el informe con ID ${idSeccion}:`, error);
    throw error;
  }
};
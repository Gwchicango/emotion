import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function AuthPage() {
  const history = useHistory();

  useEffect(() => {
    // Obtener la ruta actual
    const path = window.location.pathname;

    // Redirigir según la ruta actual
    if (path.endsWith('/login')) {
      history.push('/login');
    } else if (path.endsWith('/register')) {
      history.push('/register');
    } else {
      // Redirigir a una página por defecto si la ruta no coincide
      history.push('/login');
    }
  }, [history]);

  return null; // No mostrar nada mientras se redirige
}
import { useState, useEffect } from 'react';
import { getUserById } from '../services/api/userService';
import type { UserDetailedResponse } from '../services/api/userService';

export const useUserDetail = (userId: string | null) => {
  const [data, setData] = useState<UserDetailedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay ID o se cierra el modal, reseteamos estado
    if (!userId) {
      setData(null);
      setError(null);
      return;
    }

    const fetchUserDetail = async () => {
      // Verificación local (Offline First)
      if (!navigator.onLine) {
        setError("No hay conexión a internet para ver detalles remotos. El modo offline permite encolar acciones, pero no consultar detalles no cacheados.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userInfo = await getUserById(userId);
        setData(userInfo);
      } catch (err: any) {
        console.error("Error obteniendo detalle de usuario:", err);
        // Si el backend es de Spring Boot, el 404 viene típicamente por acá
        if (err.response && err.response.status === 404) {
          setError("El usuario no existe o no fue encontrado.");
        } else {
          setError("No se pudo cargar la información del usuario.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  return { data, loading, error };
};

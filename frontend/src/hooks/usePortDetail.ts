import { useState, useEffect, useCallback } from 'react';
import { getPortById } from '../services/api/portService';
import type { PortDetailedResponse } from '../types/port';

export const usePortDetail = (portId: string | null) => {
  const [port, setPort] = useState<PortDetailedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(0);

  // Función para forzar el reintento sumando uno al estado de versión
  const retry = useCallback(() => {
    setVersion((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!portId) {
      setPort(null);
      setError(null);
      return;
    }

    const fetchPortDetail = async () => {
      if (!navigator.onLine) {
        setError("SERVER_ERROR");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const portInfo = await getPortById(portId);
        setPort(portInfo);
      } catch (err: any) {
        console.error("Error obteniendo detalle del puerto:", err);
        if (err.response && err.response.status === 404) {
          setError("NOT_FOUND"); // Machea con el componente
        } else {
          setError("SERVER_ERROR"); // Machea con el componente
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortDetail();
  }, [portId, version]); // Al cambiar 'version', se dispara de nuevo

  // Retornamos exactamente lo que la vista PortDetail necesita desestructurar
  return { port, loading, error, retry };
};
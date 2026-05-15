import { useState, useEffect } from 'react';
import { getPortById } from '../services/api/portService';
import type { PortDetailedResponse } from '../services/api/portService';

export const usePortDetail = (portId: string | null) => {
  const [data, setData] = useState<PortDetailedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay ID o se cierra el modal, reseteamos estado
    if (!portId) {
      setData(null);
      setError(null);
      return;
    }

    const fetchPortDetail = async () => {
      // Verificación local (Offline First)
      if (!navigator.onLine) {
        setError("No hay conexión a internet para ver detalles remotos.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const portInfo = await getPortById(portId);
        setData(portInfo);
      } catch (err: any) {
        console.error("Error obteniendo detalle del puerto:", err);
        // Si el backend es de Spring Boot, el 404 viene típicamente por acá
        if (err.response && err.response.status === 404) {
          setError("El puerto no existe o no fue encontrado");
        } else {
          setError("No se pudo cargar la información del puerto");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortDetail();
  }, [portId]);

  return { data, loading, error };
};

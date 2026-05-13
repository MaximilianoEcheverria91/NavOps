import { useState, useEffect, useCallback } from 'react';
import { getPortById} from '../services/api/portService';
import type { PortResponse } from '../services/api/portService';

interface UsePortDetailResult {
  port: PortResponse | null;
  loading: boolean;
  error: 'NOT_FOUND' | 'SERVER_ERROR' | null;
  retry: () => void;
}

export const usePortDetail = (portId: string | null): UsePortDetailResult => {
  const [port, setPort] = useState<PortResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'NOT_FOUND' | 'SERVER_ERROR' | null>(null);

  const fetchPort = useCallback(async () => {
    if (!portId) return;

    setLoading(true);
    setError(null);
    setPort(null);

    try {
      const data = await getPortById(portId);
      setPort(data);
    } catch (err: any) {
  // Agregá esto para ver el error real en consola
  console.error('Error status:', err?.response?.status);
  console.error('Error detail:', err?.response?.data);
  console.error('Error completo:', err);

  const status = err?.response?.status;
  if (status === 404) {
    setError('NOT_FOUND');
  } else {
    setError('SERVER_ERROR');
  }
}
  }, [portId]);

  useEffect(() => {
    fetchPort();
  }, [fetchPort]);

  return { port, loading, error, retry: fetchPort };
};
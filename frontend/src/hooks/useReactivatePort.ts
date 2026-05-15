import { useState } from 'react';
import { reactivatePort } from '../services/api/portService';

type ReactivateError = 'NOT_FOUND' | 'SERVER_ERROR' | null;

interface UseReactivatePortResult {
  loading: boolean;
  error: ReactivateError;
  confirmReactivate: (id: string) => Promise<boolean>;
}

export const useReactivatePort = (): UseReactivatePortResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ReactivateError>(null);

  const confirmReactivate = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await reactivatePort(id);
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      setError(status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, confirmReactivate };
};

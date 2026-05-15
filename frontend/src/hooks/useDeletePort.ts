import { useState } from 'react';
import { deletePort } from '../services/api/portService';

type DeleteError = 'NOT_FOUND' | 'SERVER_ERROR' | null;

interface UseDeletePortResult {
  loading: boolean;
  error: DeleteError;
  confirmDelete: (id: string) => Promise<boolean>;
}

export const useDeletePort = (): UseDeletePortResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DeleteError>(null);

  const confirmDelete = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deletePort(id);
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      setError(status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, confirmDelete };
};
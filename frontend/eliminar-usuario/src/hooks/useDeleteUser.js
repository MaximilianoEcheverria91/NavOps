import { useState, useCallback } from 'react';
import { deleteUser } from '../services/api/usersService';

/**
 * useDeleteUser
 * Encapsulates all state and logic for the delete confirmation flow.
 *
 * States:
 *   idle      → no modal open
 *   confirm   → modal open, waiting for user action
 *   loading   → DELETE in progress
 *   success   → deleted successfully
 *   error     → deletion failed
 */
export function useDeleteUser(onSuccess) {
  const [state, setState]   = useState('idle');   // 'idle' | 'confirm' | 'loading' | 'success' | 'error'
  const [target, setTarget] = useState(null);      // user object to delete
  const [message, setMessage] = useState('');
  const [wasOffline, setWasOffline] = useState(false);

  /** Open the confirmation modal for a given user */
  const openConfirm = useCallback((user) => {
    setTarget(user);
    setState('confirm');
    setMessage('');
  }, []);

  /** Close/cancel without any changes */
  const cancel = useCallback(() => {
    setState('idle');
    setTarget(null);
    setMessage('');
  }, []);

  /** Execute DELETE */
  const confirm = useCallback(async () => {
    if (!target) return;
    setState('loading');

    try {
      const result = await deleteUser(target.id);
      setWasOffline(result.offline);
      setMessage(
        result.offline
          ? `Eliminación de ${target.nombres} encolada. Se sincronizará al reconectar.`
          : `${target.nombres} ${target.apellido} fue eliminado correctamente.`
      );
      setState('success');
      onSuccess?.(target.id, result.offline);
    } catch (err) {
      setMessage(err.response?.data?.message || 'No se pudo eliminar el usuario. Intentá de nuevo.');
      setState('error');
    }
  }, [target, onSuccess]);

  /** Reset after toast is dismissed */
  const reset = useCallback(() => {
    setState('idle');
    setTarget(null);
    setMessage('');
    setWasOffline(false);
  }, []);

  return {
    state,
    target,
    message,
    wasOffline,
    isModalOpen:   state === 'confirm' || state === 'loading',
    isLoading:     state === 'loading',
    isSuccess:     state === 'success',
    isError:       state === 'error',
    openConfirm,
    cancel,
    confirm,
    reset,
  };
}

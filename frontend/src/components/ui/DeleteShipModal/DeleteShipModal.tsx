import React, { useState } from 'react';
import { deactivateShip } from '../../../services/api/shipService';
import { FeedbackModal } from '../FeedbackModal/FeedbackModal';
import styles from './DeleteShipModal.module.css';
import { Anchor } from 'lucide-react';

interface Props {
  shipId: string;
  shipName: string;
  registration: string;
  mainImageUrl?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const DeleteShipModal: React.FC<Props> = ({
  shipId,
  shipName,
  registration,
  mainImageUrl,
  onCancel,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deactivateShip(shipId);
      setShowSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('NOT_FOUND');
      } else {
        setError('SERVER_ERROR');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onSuccess();
  };

  if (showSuccess) {
    return (
      <FeedbackModal
        message="Se ha dado de baja el barco."
        onClose={handleSuccessClose}
      />
    );
  }

  const errorMessage =
    error === 'NOT_FOUND'
      ? 'El barco no existe o ya fue eliminado.'
      : error === 'SERVER_ERROR'
      ? 'No se pudo eliminar el barco. Intente nuevamente.'
      : null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        {mainImageUrl ? (
          <img src={mainImageUrl} alt={shipName} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Anchor size={48} color="rgba(14, 165, 233, 0.4)" />
          </div>
        )}

        <div className={styles.body}>
          <p className={styles.portName}>{shipName}</p>
          <p className={styles.portLocation}>Matrícula: {registration}</p>
          <hr className={styles.divider} />
          <p className={styles.question}>
            ¿Estás seguro de que deseas dar de baja este barco?
          </p>
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnCancel}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={styles.btnDelete}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Dar de baja'}
          </button>
        </div>
      </div>
    </div>
  );
};
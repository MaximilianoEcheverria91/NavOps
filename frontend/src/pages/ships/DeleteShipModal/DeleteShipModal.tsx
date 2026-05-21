import React, { useState } from 'react';
import { Anchor } from 'lucide-react';
import { deleteShip } from '../../../services/api/shipService';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import styles from './DeleteShipModal.module.css';

interface Props {
  shipId: string;
  shipName: string;
  registration: string;
  mainImageUrl?: string | null;
  onCancel: () => void;
  onDeleted: () => void;
}

export const DeleteShipModal: React.FC<Props> = ({
  shipId,
  shipName,
  registration,
  mainImageUrl,
  onCancel,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteShip(shipId);
      setShowSuccess(true);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setError('El barco no existe o ya fue eliminado.');
      } else {
        setError('No se pudo eliminar el barco. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <FeedbackModal
        message="Barco eliminado correctamente."
        onClose={onDeleted}
      />
    );
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        {mainImageUrl ? (
          <img src={mainImageUrl} alt={shipName} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Anchor size={48} color="rgba(14,165,233,0.4)" />
          </div>
        )}

        <div className={styles.body}>
          <p className={styles.shipName}>{shipName}</p>
          <p className={styles.shipMeta}>Matrícula: {registration}</p>
          <hr className={styles.divider} />
          <p className={styles.question}>
            ¿Estás seguro de que deseas eliminar el registro de este barco? Esta acción no se puede deshacer.
          </p>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className={styles.btnDelete} onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

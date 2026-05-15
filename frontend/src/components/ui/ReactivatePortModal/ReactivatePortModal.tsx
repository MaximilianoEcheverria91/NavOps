import React, { useState } from 'react';
import { useReactivatePort } from '../../../hooks/useReactivatePort';
import { FeedbackModal } from '../FeedbackModal/FeedbackModal';
import styles from './ReactivatePortModal.module.css';

interface Props {
  portId: string;
  portName: string;
  portLocation: string;
  mainImageUrl?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ReactivatePortModal: React.FC<Props> = ({
  portId,
  portName,
  portLocation,
  mainImageUrl,
  onCancel,
  onSuccess,
}) => {
  const { loading, error, confirmReactivate } = useReactivatePort();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReactivate = async () => {
    const success = await confirmReactivate(portId);
    if (success) setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    onSuccess();
  };

  if (showSuccess) {
    return (
      <FeedbackModal
        message="El puerto se ha dado de alta correctamente"
        onClose={handleSuccessClose}
      />
    );
  }

  const errorMessage =
    error === 'NOT_FOUND'
      ? 'El puerto no existe o no se pudo encontrar.'
      : error === 'SERVER_ERROR'
      ? 'No se pudo dar de alta el puerto. Intente nuevamente.'
      : null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>

        {mainImageUrl
          ? <img src={mainImageUrl} alt={portName} className={styles.image} />
          : <div className={styles.imagePlaceholder} />
        }

        <div className={styles.body}>
          <p className={styles.portName}>{portName}</p>
          <p className={styles.portLocation}>{portLocation}</p>
          <hr className={styles.divider} />
          <p className={styles.question}>
            ¿Estás seguro que quieres dar de alta este puerto?
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
            className={styles.btnReactivate}
            onClick={handleReactivate}
            disabled={loading}
          >
            {loading ? 'Dando de alta...' : 'Ok'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReactivatePortModal;

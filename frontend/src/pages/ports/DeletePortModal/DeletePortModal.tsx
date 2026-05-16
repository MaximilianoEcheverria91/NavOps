import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeletePort } from '../../../hooks/useDeletePort';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import styles from './DeletePortModal.module.css';

interface Props {
  portId: string;
  portName: string;
  portLocation: string;
  mainImageUrl?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const DeletePortModal: React.FC<Props> = ({
  portId,
  portName,
  portLocation,
  mainImageUrl,
  onCancel,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { loading, error, confirmDelete } = useDeletePort();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    const success = await confirmDelete(portId);
    if (success) setShowSuccess(true);
  };

  // Tras aceptar el FeedbackModal → navegar a la lista
  const handleSuccessClose = () => {
    onSuccess();
  };

  // Mostrar FeedbackModal de éxito
  if (showSuccess) {
    return (
      <FeedbackModal
        message="Se ha dado de baja el puerto."
        onClose={handleSuccessClose}
      />
    );
  }

  const errorMessage =
    error === 'NOT_FOUND'
      ? 'El puerto no existe o ya fue eliminado.'
      : error === 'SERVER_ERROR'
      ? 'No se pudo eliminar el puerto. Intente nuevamente.'
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
            ¿Estás seguro de que quieres eliminar este Puerto?
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
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeletePortModal;
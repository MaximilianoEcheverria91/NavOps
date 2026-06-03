import React from 'react';
import styles from './AlertModal.module.css';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  highlightText: string;
  buttonText?: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  highlightText,
  buttonText = 'Aceptar',
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBody}>
          
          {/* Icono de Alerta */}
          <div className={styles.iconContainer}>
            <span className={styles.warningIcon}>⚠️</span>
          </div>

          {/* Textos Dinámicos */}
          <h3 className={styles.modalTitle}>{title}</h3>
          <p className={styles.modalHighlight}>{highlightText}</p>

          {/* Botón de Acción */}
          <button className={styles.modalButton} onClick={onClose}>
            {buttonText}
          </button>

        </div>
      </div>
    </div>
  );
};
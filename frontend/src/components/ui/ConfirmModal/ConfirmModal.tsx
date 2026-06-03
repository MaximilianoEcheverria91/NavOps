import React from 'react';
import styles from '../AlertModal/AlertModal.module.css'; // Reutilizamos el efecto blur

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} style={{ borderColor: '#0ea5e9' }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBody}>
          
          <div className={styles.iconContainer}>
            <span className={styles.warningIcon} style={{ color: '#f59e0b' }}>⚠️</span>
          </div>

          <h3 className={styles.modalTitle}>{title}</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>{description}</p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className={styles.modalButton} 
              style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#94a3b8' }}
              onClick={onCancel}
            >
              No, cancelar
            </button>
            <button 
              className={styles.modalButton} 
              style={{ backgroundColor: '#7f1d1d', borderColor: '#ef4444', color: '#ffffff' }}
              onClick={onConfirm}
            >
              Sí, salir
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { User, Clock } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  user: {
    name: string;
    surname: string;
    position: string;
    fileNumber: string;
    yearsOfService: number;
    avatarUrl: string | null;
    systemRole: string | null;
  } | null;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  user
}) => {
  if (!isOpen || !user) return null;

  const belongsToSystem = !!user.systemRole;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <div className={styles.userInfoContainer}>
          <div className={styles.avatarWrapper}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${user.name} ${user.surname}`} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={60} strokeWidth={1.5} />
              </div>
            )}
          </div>
          
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{user.name} {user.surname}</h2>
            <p className={styles.userRole}>{user.position}</p>
            
            <div className={styles.detailItem}>
              <User size={16} />
              <span>Legajo: <span className={styles.detailValue}>{user.fileNumber}</span></span>
            </div>
            
            <div className={styles.detailItem}>
              <Clock size={16} />
              <span><span className={styles.detailValue}>{user.yearsOfService}</span> años</span>
            </div>

            {belongsToSystem && (
              <span className={styles.systemBadge}>Acceso al Sistema</span>
            )}
          </div>
        </div>

        <p className={styles.questionText}>
          ¿Estas seguro de que quieres eliminar este Usuario?
        </p>

        <hr className={styles.divider} />

        <div className={styles.actions}>
          <button 
            className={styles.btnCancel} 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button 
            className={styles.btnDelete} 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className={styles.spinner}></span>
            ) : (
              "Dar de baja"
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

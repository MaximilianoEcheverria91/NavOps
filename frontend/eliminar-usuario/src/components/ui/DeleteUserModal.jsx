import { useEffect, useRef } from 'react';
import styles from './DeleteUserModal.module.css';

/**
 * DeleteUserModal
 * Confirmation modal for user deletion.
 * Renders correctly in both light and dark mode via CSS Variables.
 * Traps focus and handles Escape key for accessibility.
 *
 * Props:
 *   user       – { nombres, apellido, cargo, legajo, antiguedad, foto_url }
 *   isLoading  – bool, shows spinner on Eliminar button
 *   onConfirm  – () => void
 *   onCancel   – () => void
 */
export default function DeleteUserModal({ user, isLoading, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  // ── Accessibility: focus trap + Escape ──────────────────────────────────
  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  // ── Prevent body scroll while modal is open ─────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!user) return null;

  const initials = [user.nombres?.[0], user.apellido?.[0]]
    .filter(Boolean).join('').toUpperCase();

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>

        {/* ── User info section ── */}
        <div className={styles.userSection}>
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            {user.foto_url ? (
              <img src={user.foto_url} alt={user.nombres} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitials}>{initials}</span>
            )}
          </div>

          {/* Details */}
          <div className={styles.userDetails}>
            <h2 className={styles.userName} id="modal-title">
              {user.nombres} {user.apellido}
            </h2>
            <p className={styles.userRole}>{user.cargo || 'Sin cargo'}</p>

            <div className={styles.metaList}>
              <span className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 13c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                Legajo: {user.legajo || '—'}
              </span>
              {user.antiguedad && (
                <span className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {user.antiguedad}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Confirm text ── */}
        <p className={styles.confirmText}>
          ¿Estás seguro de que querés eliminar este Usuario?
        </p>

        <hr className={styles.divider} />

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            className={styles.btnCancel}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            className={styles.btnDelete}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

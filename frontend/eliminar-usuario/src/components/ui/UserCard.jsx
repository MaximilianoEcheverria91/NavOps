import styles from './UserCard.module.css';

/**
 * UserCard
 * Displays a user summary card with an integrated delete action button.
 * The delete icon triggers the confirmation modal flow.
 *
 * Props:
 *   user        – user object
 *   onDelete    – (user) => void  ← triggers modal
 *   isDeleting  – bool, disables button while in progress
 */
export default function UserCard({ user, onDelete, isDeleting }) {
  const initials = [user.nombres?.[0], user.apellido?.[0]]
    .filter(Boolean).join('').toUpperCase();

  return (
    <article className={styles.card}>
      {/* ── Avatar ── */}
      <div className={styles.avatarWrap}>
        {user.foto_url ? (
          <img src={user.foto_url} alt={user.nombres} className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarInitials}>{initials}</span>
        )}
      </div>

      {/* ── Info ── */}
      <div className={styles.info}>
        <p className={styles.name}>{user.nombres} {user.apellido}</p>
        <p className={styles.role}>{user.cargo || 'Sin cargo'}</p>
        <p className={styles.legajo}>Legajo: {user.legajo || '—'}</p>
      </div>

      {/* ── Status badge ── */}
      <span className={`${styles.badge} ${user.estado === 'Activo' ? styles.badgeActive : styles.badgeInactive}`}>
        {user.estado || 'Activo'}
      </span>

      {/* ── Delete action ── */}
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(user)}
        disabled={isDeleting}
        title="Eliminar usuario"
        aria-label={`Eliminar a ${user.nombres} ${user.apellido}`}
      >
        <svg viewBox="0 0 20 20" fill="none" className={styles.deleteIcon}>
          <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </article>
  );
}

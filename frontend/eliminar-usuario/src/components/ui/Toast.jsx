import { useEffect } from 'react';
import styles from './Toast.module.css';

/**
 * Toast
 * Auto-dismissing notification for success/error feedback.
 * Supports offline badge when action was queued locally.
 *
 * Props:
 *   message   – string
 *   type      – 'success' | 'error'
 *   offline   – bool, shows ⚓ offline badge
 *   onDismiss – () => void
 *   duration  – ms (default 4000)
 */
export default function Toast({ message, type = 'success', offline = false, onDismiss, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div
      className={`${styles.toast} ${type === 'success' ? styles.success : styles.error}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className={styles.message}>{message}</span>
      {offline && <span className={styles.offlineBadge}>⚓ Offline</span>}
      <button className={styles.closeBtn} onClick={onDismiss} aria-label="Cerrar">×</button>
    </div>
  );
}

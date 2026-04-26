import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import styles from './NetworkBanner.module.css';

/**
 * NetworkBanner
 * Shows a contextual banner when the app is offline or just reconnected.
 * Critical for maritime environments where connectivity is unpredictable.
 */
export default function NetworkBanner({ isSyncing }) {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !isSyncing && !wasOffline) return null;

  return (
    <div className={`${styles.banner} ${
      !isOnline ? styles.offline :
      isSyncing ? styles.syncing :
      styles.online
    }`}>
      <span className={styles.dot} />
      <span className={styles.text}>
        {!isOnline && '⚓ Sin conexión — los cambios se guardarán localmente y sincronizarán al reconectar.'}
        {isOnline && isSyncing && '↻ Sincronizando cambios pendientes con el servidor...'}
        {isOnline && !isSyncing && wasOffline && '✓ Conexión restaurada.'}
      </span>
    </div>
  );
}

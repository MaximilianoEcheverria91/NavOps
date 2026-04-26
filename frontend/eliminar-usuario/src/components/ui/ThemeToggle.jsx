import styles from './ThemeToggle.module.css';

/**
 * ThemeToggle
 * Sun/Moon toggle button for switching between light and dark modes.
 */
export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className={styles.toggle}
      onClick={onToggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      <span className={styles.icon}>{isDark ? '☀' : '🌙'}</span>
    </button>
  );
}

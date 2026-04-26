import styles from './SectionBlock.module.css';

/**
 * SectionBlock
 * Wraps a form section with a colored dot, title, and content.
 */
export default function SectionBlock({ title, children }) {
  return (
    <div className={styles.block}>
      <div className={styles.title}>
        <span className={styles.dot} />
        {title}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

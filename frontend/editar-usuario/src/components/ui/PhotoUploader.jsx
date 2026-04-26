import { useRef } from 'react';
import styles from './PhotoUploader.module.css';

/**
 * PhotoUploader
 * Circular photo uploader with preview, replacement, and removal.
 * Validates format (PNG/JPG) and size (max 5MB) before preview.
 */
export default function PhotoUploader({ preview, error, onChange, onRemove }) {
  const inputRef = useRef(null);

  return (
    <div className={styles.wrapper}>
      {/* ── Dropzone ── */}
      <div
        className={`${styles.dropzone} ${preview ? styles.hasImage : ''}`}
        onClick={() => inputRef.current?.click()}
        title="Cambiar foto"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className={styles.fileInput}
          onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
        />

        {preview ? (
          <>
            <img src={preview} alt="Vista previa" className={styles.preview} />
            <div className={styles.overlay}>
              <span className={styles.overlayText}>Cambiar</span>
            </div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              title="Quitar foto"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <span className={styles.uploadIcon}>⬆</span>
            <span className={styles.uploadLabel}>Cargar Foto</span>
            <span className={styles.uploadHint}>PNG, JPG (Máx 5MB)</span>
          </>
        )}
      </div>

      {/* ── Info ── */}
      <div className={styles.info}>
        <span className={styles.badge}>Recomendado</span>
        <p className={styles.desc}>
          Se recomienda una fotografía de perfil con buena iluminación.
          La imagen debe ser clara y mostrar las características principales.
        </p>
        {error && <span className={styles.photoError}>{error}</span>}
      </div>
    </div>
  );
}

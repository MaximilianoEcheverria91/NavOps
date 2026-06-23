import React from 'react';
import { usePortDetail } from '../../../hooks/usePortDetail';
import styles from './PortDetail.module.css';

interface Props {
  portId: string;
  onClose: () => void;
  onEdit?: (portId: string) => void;
  onDelete?: (portId: string) => void;
}

const PortDetail: React.FC<Props> = ({ portId, onClose, onEdit, onDelete }) => {
  const { port, loading, error, retry } = usePortDetail(portId) as any;
  
  // Escenario 3: Error de servidor
  if (!loading && error === 'SERVER_ERROR') {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.stateContainer}>
            <span>⚠️</span>
            <p>No se pudo cargar la información del puerto.</p>
            <div className={styles.stateActions}>
              <button className={styles.btnEdit} onClick={retry}>Reintentar</button>
              <button className={styles.btnEdit} onClick={onClose}>Volver</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Escenario 2: Puerto no encontrado
  if (!loading && error === 'NOT_FOUND') {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.stateContainer}>
            <span>🔍</span>
            <p>El puerto no existe o no fue encontrado.</p>
            <button className={styles.btnEdit} onClick={onClose}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {/* Ícono ancla SVG inline — sin dependencia extra */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="3"/>
              <line x1="12" y1="8" x2="12" y2="21"/>
              <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
            </svg>
            Detalle del Puerto
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnDownload} disabled={!port}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar
            </button>
            <button className={styles.btnClose} onClick={onClose} aria-label="Cerrar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className={styles.stateContainer}>
            <p>Cargando información del puerto...</p>
          </div>
        )}

        {/* Escenario 1: datos cargados */}
        {!loading && port && (
          <>
            {/* Imagen */}
            {port.mainImageUrl
              ? <img src={port.mainImageUrl} alt={port.name} className={styles.portImage} />
              : <div className={styles.imagePlaceholder}>Sin imagen disponible</div>
            }

            <div className={styles.body}>

              {/* Información General */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Información General</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <span className={styles.label}>Nombre del Puerto:</span>
                    <span className={styles.value}>{port.name}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Tipo de Puerto:</span>
                    <span className={styles.value}>{port.portType}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Código Internacional:</span>
                    <span className={styles.value}>{port.code}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Tipo de Muelle:</span>
                    <span className={styles.value}>{port.dockType}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Cantidad de Muelles:</span>
                    <span className={styles.value}>{port.dockCount}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Eslora Máximo:</span>
                    <span className={styles.value}>{port.maxLength}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Bandera/País:</span>
                    <span className={styles.value}>{port.country}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Calado Máximo:</span>
                    <span className={styles.value}>{port.maxDraft}</span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ubicación</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <span className={styles.label}>País:</span>
                    <span className={styles.value}>{port.country}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Latitud:</span>
                    <span className={styles.value}>{port.latitude}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Provincia:</span>
                    <span className={styles.value}>{port.province}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Longitud:</span>
                    <span className={styles.value}>{port.longitude}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Ciudad:</span>
                    <span className={styles.value}>{port.city}</span>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Contacto</h3>
                <div className={styles.grid}>
                  <div className={styles.field}>
                    <span className={styles.label}>Nº de Teléfono:</span>
                    <span className={styles.value}>{port.contactPhone}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Web:</span>
                    <span className={styles.value}>{port.contactWeb}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Mail:</span>
                    <span className={styles.value}>{port.contactEmail}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <button
                className={styles.btnEdit}
                onClick={() => onEdit?.(port.id)}
                aria-label="Editar puerto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                className={styles.btnDelete}
                onClick={() => onDelete?.(port.id)}
                aria-label="Eliminar puerto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PortDetail;
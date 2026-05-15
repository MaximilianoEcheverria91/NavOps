import React, { useState } from 'react';
import { X, Download, Anchor, Edit2, Trash2 } from 'lucide-react';
import styles from './PortDetailModal.module.css';
import { usePortDetail } from '../../../hooks/usePortDetail';

interface PortDetailModalProps {
  portId: string;
  onClose: () => void;
}

export const PortDetailModal: React.FC<PortDetailModalProps> = ({ portId, onClose }) => {
  const { data: port, loading, error } = usePortDetail(portId);
  const [imageError, setImageError] = useState(false);

  // Prevenir propagación de click para que cerrar funcione solo en el fondo overlay
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  React.useEffect(() => {
    if (port) {
      console.log('Datos del puerto recibidos en Modal:', port);
      setImageError(false); // reset error state when new port loads
    }
  }, [port]);

  const imageUrl = port?.mainImageUrl || (port as any)?.['main_image_url'] || null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalContentClick}>

        {/* CABECERA */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <Anchor size={24} color="#63BACF" />
            <h2 className={styles.title}>Detalle del Puerto</h2>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.downloadBtn}>
              Descargar <Download size={14} />
            </button>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.centerMessage}>
              <p>Cargando información del puerto...</p>
            </div>
          ) : error ? (
            <div className={styles.centerMessage}>
              <p className={styles.errorText}>{error}</p>
              <button
                className={styles.downloadBtn}
                onClick={onClose}
              >
                Volver
              </button>
            </div>
          ) : port ? (
            <>
              {/* IMAGEN DEL PUERTO */}
              <div className={styles.imageSection}>
                {imageUrl && imageUrl !== 'null' ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={port.name}
                      className={styles.portImage}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  </>
                ) : (
                  <div className={styles.placeholderImage}>
                    <Anchor size={64} opacity={0.4} />
                    <p style={{marginTop: '8px', fontSize: '0.8rem'}}>Sin imagen ({String(imageUrl)})</p>
                  </div>
                )}
              </div>

              {/* SECCIÓN INFORMACIÓN GENERAL */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Información General</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Nombre del Puerto:</span>
                    <span className={styles.dataValue}>{port.name || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Tipo de Puerto:</span>
                    <span className={styles.dataValue}>{port.portType || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Código Internacional:</span>
                    <span className={styles.dataValue}>{port.code || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Tipo de Muelle:</span>
                    <span className={styles.dataValue}>{port.dockType || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Cantidad de Muelles:</span>
                    <span className={styles.dataValue}>{port.dockCount != null ? port.dockCount : '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Eslora Máximo:</span>
                    <span className={styles.dataValue}>{port.maxLength != null ? port.maxLength : '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Bandera/País:</span>
                    <span className={styles.dataValue}>{port.country || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Calado Máximo:</span>
                    <span className={styles.dataValue}>{port.maxDraft != null ? port.maxDraft : '-'}</span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN UBICACIÓN */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Ubicación</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>País:</span>
                    <span className={styles.dataValue}>{port.country || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Latitud:</span>
                    <span className={styles.dataValue}>{port.latitude != null ? port.latitude : '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Provincia:</span>
                    <span className={styles.dataValue}>{port.province || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Longitud:</span>
                    <span className={styles.dataValue}>{port.longitude != null ? port.longitude : '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Ciudad:</span>
                    <span className={styles.dataValue}>{port.city || '-'}</span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN CONTACTO */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Contacto</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Nº de Teléfono:</span>
                    <span className={styles.dataValue}>{port.contactPhone || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Web:</span>
                    <span className={styles.dataValue}>{port.contactWeb || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Mail:</span>
                    <span className={styles.dataValue}>{port.contactEmail || '-'}</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* FOOTER ACTIONS */}
        {!loading && !error && port && (
          <div className={styles.footerActions}>
            <button className={styles.editActionBtn} title="Editar Puerto">
              <Edit2 size={16} />
            </button>
            <button className={styles.deleteActionBtn} title="Eliminar Puerto">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

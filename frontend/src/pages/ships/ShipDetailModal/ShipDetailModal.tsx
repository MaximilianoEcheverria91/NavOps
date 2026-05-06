// frontend/src/pages/ships/ShipDetailModal/ShipDetailModal.tsx
import React from 'react';
import { X, Anchor } from 'lucide-react';
import { useShipDetail } from '../../../hooks/useShipDetail';
import styles from './ShipDetailModal.module.css';

interface ShipDetailModalProps {
  shipId: string;
  onClose: () => void;
}

const val = (v: string | number | null | undefined): string =>
  v !== null && v !== undefined ? String(v) : '—';

export const ShipDetailModal: React.FC<ShipDetailModalProps> = ({ shipId, onClose }) => {
  const { data: ship, loading, error } = useShipDetail(shipId);

  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalClick}>

        <div className={styles.header}>
          <div className={styles.titleArea}>
            <Anchor size={22} color="#63BACF" />
            <h2 className={styles.title}>Detalle del Barco</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.centerMessage}>
              <p>Cargando información del barco...</p>
            </div>
          ) : error ? (
            <div className={styles.centerMessage}>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryBtn} onClick={onClose}>Volver</button>
            </div>
          ) : ship ? (
            <>
              {/* TOP: imagen + info general */}
              <div className={styles.topSection}>
                <div className={styles.shipImageWrapper}>
                  {ship.mainImageUrl ? (
                    <img src={ship.mainImageUrl} alt={ship.name} className={styles.shipImage} />
                  ) : (
                    <Anchor size={56} color="rgba(14,165,233,0.3)" />
                  )}
                </div>

                <div className={styles.infoBlock}>
                  <h3 className={styles.sectionTitle}>Información General</h3>
                  <div className={styles.gridData}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Nombre:</span>
                      <span className={styles.dataValue}>{val(ship.name)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Matrícula:</span>
                      <span className={styles.dataValue}>{val(ship.registration)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Número IMO:</span>
                      <span className={styles.dataValue}>{val(ship.imoNumber)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Tipo de Barco:</span>
                      <span className={styles.dataValue}>{val(ship.shipType)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Año de Construcción:</span>
                      <span className={styles.dataValue}>{val(ship.buildYear)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Bandera / País:</span>
                      <span className={styles.dataValue}>{val(ship.countryName)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Estado:</span>
                      <span className={styles.dataValue}>{val(ship.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Identificación Técnica */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Identificación Técnica</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Número de Casco:</span>
                    <span className={styles.dataValue}>{val(ship.hullNumber)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Número de Motor:</span>
                    <span className={styles.dataValue}>{val(ship.engineSerialNumber)}</span>
                  </div>
                </div>
              </div>

              {/* Especificaciones Físicas */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Especificaciones Físicas</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Eslora (m):</span>
                    <span className={styles.dataValue}>{val(ship.length)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Manga (m):</span>
                    <span className={styles.dataValue}>{val(ship.beam)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Calado (m):</span>
                    <span className={styles.dataValue}>{val(ship.draft)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Puntal (m):</span>
                    <span className={styles.dataValue}>{val(ship.depth)}</span>
                  </div>
                </div>
              </div>

              {/* Capacidades */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Capacidades</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Capacidad de Tripulantes:</span>
                    <span className={styles.dataValue}>{val(ship.crewCapacity)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Cantidad de Bodegas:</span>
                    <span className={styles.dataValue}>{val(ship.holdCount)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Capacidad de Carga (ton.):</span>
                    <span className={styles.dataValue}>{val(ship.cargoCapacityTonnes)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Capacidad de Nafta (L):</span>
                    <span className={styles.dataValue}>{val(ship.fuelCapacityLiters)}</span>
                  </div>
                </div>
              </div>

              {/* Motor y Mantenimiento */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Motor y Mantenimiento</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Modelo del Motor:</span>
                    <span className={styles.dataValue}>{val(ship.engineModel)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Horas Acumuladas:</span>
                    <span className={styles.dataValue}>{val(ship.currentEngineHours)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Horas del Último Overhaul:</span>
                    <span className={styles.dataValue}>{val(ship.lastTboEngineHours)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Fecha Último Mantenimiento:</span>
                    <span className={styles.dataValue}>{val(ship.lastMaintenanceDate)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

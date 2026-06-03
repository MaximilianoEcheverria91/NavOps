import React from 'react';
import styles from './CargoDetailModal.module.css';
import type { CargoRequest } from '../../../types/cargoType';
import { CARGO_CATEGORIES, CARGO_TYPES } from '../../../types/cargoType';

interface CargoDetailModalProps {
  isOpen: boolean;
  cargo: CargoRequest | null;
  onClose: () => void;
  isLightTheme?: boolean; // 🌓 Control de tema nativo
}

export const CargoDetailModal: React.FC<CargoDetailModalProps> = ({
  isOpen,
  cargo,
  onClose,
  isLightTheme = false
}) => {
  if (!isOpen || !cargo) return null;

  // Funciones de mapeo interno para mantener el componente aislado y reutilizable
  const getCategoryLabel = (value: string) => {
    return CARGO_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const getTypeLabel = (value: string) => {
    return CARGO_TYPES.find(c => c.value === value)?.label || value;
  };

  // Mapeamos dinámicamente si trae datos extendidos o usamos fallbacks
  const enterprise = (cargo as any).ownerEnterprise || 'Estado Nacional Argentino';
  const productType = (cargo as any).productType || 'No especificado';
  const containerType = (cargo as any).containerType || 'Cerrado';
  const isDangerous = (cargo as any).isHazardous ? 'SÍ' : 'NO';

  return (
    <div 
      className={`${styles.modalOverlay} ${isLightTheme ? styles.lightOverlay : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`${styles.modalContent} ${isLightTheme ? styles.lightContent : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.modalTitle}>Detalle del producto</h2>
        
        <div className={`${styles.innerContainer} ${isLightTheme ? styles.lightInner : ''}`}>
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Nombre del producto:</span>
            <span className={styles.value}>{cargo.productName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Empresa Propietaria:</span>
            <span className={styles.value}>{enterprise}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Categoría del producto:</span>
            <span className={styles.value}>{getCategoryLabel(cargo.productCategory)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tipo de Producto:</span>
            <span className={styles.value}>{productType}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tipo de Carga:</span>
            <span className={styles.value}>{getTypeLabel(cargo.cargoType)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tipo de contenedor:</span>
            <span className={styles.value}>{containerType}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Material Peligroso:</span>
            <span className={styles.value}>{isDangerous}</span>
          </div>

          <div className={styles.descriptionBlock}>
            <span className={styles.label}>Descripción:</span>
            <p className={styles.descriptionText}>
              {cargo.description || 'Sin descripción disponible para este producto.'}
            </p>
          </div>

          <div className={styles.divider} />

          <div className={styles.infoRow}>
            <span className={styles.label}>Cantidad de Carga:</span>
            <span className={styles.value}>{cargo.quantity}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Volumen (m³):</span>
            <span className={styles.value}>{cargo.volumeM3}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Peso (Toneladas):</span>
            <span className={styles.value}>{cargo.weightTonnes}</span>
          </div>

        </div>

        <button className={styles.closeButton} onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};
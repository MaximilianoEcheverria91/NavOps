import React, { useState } from 'react';
import styles from './CargoFilterDropdown.module.css';
import { CARGO_CATEGORIES, CARGO_TYPES, CONTAINER_TYPES } from '../../../types/cargoType';
import type { CargoFilterState } from '../../../hooks/useCargoFilters';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  filters: CargoFilterState;
  onFilterChange: (newFilters: CargoFilterState) => void;
  onApply: (filters: CargoFilterState) => void;
  onClear: () => void;
  onClose: () => void;
}

export const CargoFilterDropdown: React.FC<Props> = ({ filters, onFilterChange, onApply, onClear, onClose }) => {
  const [localFilters, setLocalFilters] = useState<CargoFilterState>(filters);

  // Collapsible states
  const [openCategory, setOpenCategory] = useState(true);
  const [openCargoType, setOpenCargoType] = useState(true);
  const [openContainerType, setOpenContainerType] = useState(true);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleToggle = (field: keyof CargoFilterState, value: string) => {
    setLocalFilters(prev => {
      const currentVal = prev[field] as string | null | undefined;
      if (!currentVal) {
        return { ...prev, [field]: value };
      }
      const valuesArray = currentVal.split(',');
      if (valuesArray.includes(value)) {
        const newArray = valuesArray.filter(v => v !== value);
        return { ...prev, [field]: newArray.length > 0 ? newArray.join(',') : null };
      } else {
        return { ...prev, [field]: `${currentVal},${value}` };
      }
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownContent}>
        {/* Category Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenCategory(!openCategory)}>
            Categoría del producto
            {openCategory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openCategory && (
            <div className={styles.sectionBody}>
              <div className={styles.optionsGrid}>
                {CARGO_CATEGORIES.map(cat => (
                  <label key={cat.value} className={styles.checkboxLabel}>
                    <div className={`${styles.customCheckbox} ${localFilters.productCategory?.split(',').includes(cat.value) ? styles.checked : ''}`}>
                      {localFilters.productCategory?.split(',').includes(cat.value) && <div className={styles.checkmark} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={localFilters.productCategory?.split(',').includes(cat.value) || false}
                      onChange={() => handleToggle('productCategory', cat.value)}
                      hidden
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cargo Type Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenCargoType(!openCargoType)}>
            Tipo de Carga
            {openCargoType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openCargoType && (
            <div className={styles.sectionBody}>
              <div className={styles.optionsGrid}>
                {CARGO_TYPES.map(cat => (
                  <label key={cat.value} className={styles.checkboxLabel}>
                    <div className={`${styles.customCheckbox} ${localFilters.cargoType?.split(',').includes(cat.value) ? styles.checked : ''}`}>
                      {localFilters.cargoType?.split(',').includes(cat.value) && <div className={styles.checkmark} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={localFilters.cargoType?.split(',').includes(cat.value) || false}
                      onChange={() => handleToggle('cargoType', cat.value)}
                      hidden
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Container Type Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenContainerType(!openContainerType)}>
            Tipo de Contenedor
            {openContainerType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openContainerType && (
            <div className={styles.sectionBody}>
              <div className={styles.optionsGrid}>
                {CONTAINER_TYPES.map(cat => (
                  <label key={cat.value} className={styles.checkboxLabel}>
                    <div className={`${styles.customCheckbox} ${localFilters.containerType?.split(',').includes(cat.value) ? styles.checked : ''}`}>
                      {localFilters.containerType?.split(',').includes(cat.value) && <div className={styles.checkmark} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={localFilters.containerType?.split(',').includes(cat.value) || false}
                      onChange={() => handleToggle('containerType', cat.value)}
                      hidden
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <button className={styles.applyBtn} onClick={handleApply}>
          Aplicar Filtros
        </button>
        <button className={styles.clearBtn} onClick={handleClear}>
          Limpiar
        </button>
      </div>
    </div>
  );
};

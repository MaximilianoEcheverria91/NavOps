import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FilterDropdown.module.css';
import type { TravelPlanFilters } from '../../../../hooks/useTravelPlans';

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: TravelPlanFilters;
  onApplyFilters: (filters: TravelPlanFilters) => void;
  onClearFilters: () => void;
}

const ESTADOS = [
  { value: 'PLANNED', label: 'Planificado' },
  { value: 'EN_ROUTE', label: 'En curso' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'DELAYED', label: 'Demorado' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

const CATEGORIAS = [
  { value: 'ARMAMENT', label: 'Armamento' },
  { value: 'FOOD_AND_BEVERAGES', label: 'Alimentos' },
  { value: 'VEHICLES_ACCESSORIES', label: 'Vehículos' },
  { value: 'INDUSTRIAL', label: 'Maquinarias' },
  { value: 'OTHER', label: 'Otros' }
];

const TIPOS_CARGA = [
  { value: 'BULK', label: 'Granel' },
  { value: 'CONTAINER', label: 'Contenedor' },
  { value: 'PALLET', label: 'Pallet' },
  { value: 'BINER', label: 'Biner' }
];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ isOpen, onClose, currentFilters, onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState<TravelPlanFilters>(currentFilters);
  const [sections, setSections] = useState({ estados: true, fechas: false, categorias: false, tipoCarga: false, peligroso: false });

  useEffect(() => {
    if (isOpen) setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (field: 'statuses' | 'productCategories' | 'cargoTypes', value: string) => {
    setFilters(prev => {
      const currentList = (prev[field] as string[]) || [];
      const newList = currentList.includes(value) ? currentList.filter(v => v !== value) : [...currentList, value];
      return { ...prev, [field]: newList.length > 0 ? newList : undefined };
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    onClearFilters(); // Limpia los estados en el componente padre
    onClose();        // 🚀 METEMOS ESTO PARA QUE SE CIERRE LA VENTANA AL INSTANTE!
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader}>
        <h3>Filtros Avanzados</h3>
        <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
      </div>

      <div className={styles.dropdownBody}>
        {/* ESTADOS */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('estados')}>
            <h4>Estados</h4>
            {sections.estados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {sections.estados && (
            <div className={styles.checkboxGrid}>
              {ESTADOS.map(e => (
                <label key={e.value} className={styles.checkboxLabel}>
                  <input type="checkbox" checked={filters.statuses?.includes(e.value) || false} onChange={() => handleCheckboxChange('statuses', e.value)} />
                  <span>{e.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* FECHAS RANGOS COMPATIBLES */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('fechas')}>
            <h4>Fecha de Abordaje/Arribos</h4>
            {sections.fechas ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {sections.fechas && (
            <div className={styles.datesContainer}>
              <div className={styles.dateBlock}>
                <span className={styles.dateLabel}>Abordaje</span>
                <div className={styles.dateInputs}>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Desde</span>
                    <input type="date" value={filters.departureFrom || ''} onChange={(e) => setFilters(p => ({ ...p, departureFrom: e.target.value ? e.target.value + "T00:00:00Z" : undefined }))} />
                  </div>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>Hasta</span>
                    <input type="date" value={filters.departureTo || ''} onChange={(e) => setFilters(p => ({ ...p, departureTo: e.target.value ? e.target.value + "T23:59:59Z" : undefined }))} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CATEGORÍAS */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('categorias')}>
            <h4>Categoría de producto</h4>
            {sections.categorias ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {sections.categorias && (
            <div className={styles.checkboxGrid}>
              {CATEGORIAS.map(c => (
                <label key={c.value} className={styles.checkboxLabel}>
                  <input type="checkbox" checked={filters.productCategories?.includes(c.value) || false} onChange={() => handleCheckboxChange('productCategories', c.value)} />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* MATERIAL PELIGROSO */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('peligroso')}>
            <h4>Material Peligroso</h4>
            {sections.peligroso ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {sections.peligroso && (
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="hazardous" checked={filters.hazardousMaterial === true} onChange={() => setFilters(p => ({ ...p, hazardousMaterial: true }))} /> SÍ
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="hazardous" checked={filters.hazardousMaterial === false} onChange={() => setFilters(p => ({ ...p, hazardousMaterial: false }))} /> NO
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="hazardous" checked={filters.hazardousMaterial === undefined || filters.hazardousMaterial === null} onChange={() => setFilters(p => ({ ...p, hazardousMaterial: undefined }))} /> Indistinto
              </label>
            </div>
          )}
        </div>
      </div>

      <div className={styles.dropdownFooter}>
        <button className={styles.applyBtn} onClick={handleApply}>Aplicar Filtros</button>
        <button className={styles.clearBtn} onClick={handleClear}>Limpiar</button>
      </div>
    </div>
  );
};
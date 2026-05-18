// src/components/ui/PortFilterSidebar/PortFilterSidebar.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './PortFilterSidebar.module.css'; // Usaremos tus mismos estilos clonados
import { MultiSelectSelect } from '../MultiSelectSelect/MultiSelectSelect';
import { PORT_STATUSES, PORT_TYPES, DOCK_TYPES } from '../../../types/portEnums';
import type { PortFilterRequest } from '../../../types/port';

interface PortFilterSidebarProps {
  filters: PortFilterRequest;
  onFilterChange: (key: keyof PortFilterRequest, value: any) => void;
  onApply: () => void;
  onClear: () => void;
  countries: any[];
  provinces: any[];
  cities: any[];
}

export const PortFilterSidebar: React.FC<PortFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onApply,
  onClear,
  countries,
  provinces,
  cities
}) => {
  // Manejo de colapsables según las 3 secciones de tu mockup
  const [openDatosPort, setOpenDatosPort] = useState(true);
  const [openTipoPort, setOpenTipoPort] = useState(false);
  const [openMuellesDim, setOpenMuellesDim] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>

        {/* 1. DATOS DEL PUERTO */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenDatosPort(!openDatosPort)}>
            Datos del Puerto
            {openDatosPort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openDatosPort && (
            <div className={styles.sectionBody}>
              <div className={styles.inputGroup}>
                <label>País</label>
                <select
                  value={filters.countryId || ''}
                  onChange={(e) => onFilterChange('countryId', e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="">Ej: Argentina</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Provincias</label>
                <select
                  value={filters.provinceId || ''}
                  onChange={(e) => onFilterChange('provinceId', e.target.value)}
                  className={styles.selectInput}
                  disabled={!filters.countryId}
                >
                  <option value="">Ej: Buenos Aires</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Ciudad</label>
                <select
                  value={filters.cityId || ''}
                  onChange={(e) => onFilterChange('cityId', e.target.value)}
                  className={styles.selectInput}
                  disabled={!filters.provinceId}
                >
                  <option value="">Ej: Mar del Plata</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <MultiSelectSelect
                title="Estado"
                options={PORT_STATUSES}
                selectedValues={filters.statuses || []}
                onChange={(vals) => onFilterChange('statuses', vals)}
                twoColumns
              />
            </div>
          )}
        </div>

        {/* 2. TIPO DE PUERTOS */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenTipoPort(!openTipoPort)}>
            Tipo de Puertos
            {openTipoPort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openTipoPort && (
            <div className={styles.sectionBody}>
              <MultiSelectSelect
                title="Categoría de Puerto"
                options={PORT_TYPES}
                selectedValues={filters.portTypes || []}
                onChange={(vals) => onFilterChange('portTypes', vals)}
                twoColumns
              />
            </div>
          )}
        </div>

        {/* 3. TIPO DE MUELLES Y DIMENSIONES */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenMuellesDim(!openMuellesDim)}>
            Tipo de Muelles e Infraestructura
            {openMuellesDim ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openMuellesDim && (
            <div className={styles.sectionBody}>
              <MultiSelectSelect
                title="Tipo de Muelle"
                options={DOCK_TYPES}
                selectedValues={filters.dockTypes || []}
                onChange={(vals) => onFilterChange('dockTypes', vals)}
                twoColumns
              />

              <h4 className={styles.subTitle}>Cantidad de Muelles</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mínimo</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    className={styles.textInput}
                    value={filters.minDockCount ?? ''}
                    onChange={(e) => onFilterChange('minDockCount', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máximo</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    className={styles.textInput}
                    value={filters.maxDockCount ?? ''}
                    onChange={(e) => onFilterChange('maxDockCount', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Eslora Máxima Admisión (m)</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mínima</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 50"
                    className={styles.textInput}
                    value={filters.minMaxLength ?? ''}
                    onChange={(e) => onFilterChange('minMaxLength', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máxima</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 300"
                    className={styles.textInput}
                    value={filters.maxMaxLength ?? ''}
                    onChange={(e) => onFilterChange('maxMaxLength', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Calado Máximo Admisión (m)</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mínimo</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Ej: 5.5"
                    className={styles.textInput}
                    value={filters.minMaxDraft ?? ''}
                    onChange={(e) => onFilterChange('minMaxDraft', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máximo</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Ej: 15.0"
                    className={styles.textInput}
                    value={filters.maxMaxDraft ?? ''}
                    onChange={(e) => onFilterChange('maxMaxDraft', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <button className={styles.applyBtn} onClick={onApply}>Aplicar Filtros</button>
        <button className={styles.clearBtn} onClick={onClear}>Limpiar</button>
      </div>
    </aside>
  );
};
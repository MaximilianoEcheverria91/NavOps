import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './ShipFilterSidebar.module.css';
import { MultiSelectSelect } from '../MultiSelectSelect/MultiSelectSelect';
import { SHIP_STATUSES, SHIP_TYPES } from '../../../types/shipEnums';
import type { ShipFilterRequest } from '../../../types/ship';

interface ShipFilterSidebarProps {
  filters: ShipFilterRequest;
  onFilterChange: (key: keyof ShipFilterRequest, value: any) => void;
  onApply: () => void;
  onClear: () => void;
  countries: any[];
}

export const ShipFilterSidebar: React.FC<ShipFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onApply,
  onClear,
  countries
}) => {
  const [openDatosGenerales, setOpenDatosGenerales] = useState(true);
  const [openTipoBarco, setOpenTipoBarco] = useState(false);
  const [openSpecsFisicas, setOpenSpecsFisicas] = useState(false);
  const [openCapacidades, setOpenCapacidades] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>

        {/* 1. DATOS GENERALES */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenDatosGenerales(!openDatosGenerales)}>
            Datos generales
            {openDatosGenerales ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openDatosGenerales && (
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

              <MultiSelectSelect
                title="Estado"
                options={SHIP_STATUSES}
                selectedValues={filters.statuses || []}
                onChange={(vals) => onFilterChange('statuses', vals)}
                twoColumns
              />

              <h4 className={styles.subTitle} style={{marginTop: '8px'}}>Año de construcción</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mínima</label>
                  <input
                    type="number"
                    min="1800"
                    placeholder="Ej: 2000"
                    className={styles.textInput}
                    value={filters.minBuildYear ?? ''}
                    onChange={(e) => onFilterChange('minBuildYear', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máxima</label>
                  <input
                    type="number"
                    min="1800"
                    placeholder="Ej: 2024"
                    className={styles.textInput}
                    value={filters.maxBuildYear ?? ''}
                    onChange={(e) => onFilterChange('maxBuildYear', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. TIPO DE BARCO */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenTipoBarco(!openTipoBarco)}>
            Tipo de barco
            {openTipoBarco ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openTipoBarco && (
            <div className={styles.sectionBody}>
              <MultiSelectSelect
                title=""
                options={SHIP_TYPES}
                selectedValues={filters.shipTypes || []}
                onChange={(vals) => onFilterChange('shipTypes', vals)}
                twoColumns
              />
            </div>
          )}
        </div>

        {/* 3. ESPECIFICACIONES FÍSICAS */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenSpecsFisicas(!openSpecsFisicas)}>
            Especificaciones Físicas
            {openSpecsFisicas ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openSpecsFisicas && (
            <div className={styles.sectionBody}>
              <h4 className={styles.subTitle}>Eslora</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minLength ?? ''}
                    onChange={(e) => onFilterChange('minLength', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxLength ?? ''}
                    onChange={(e) => onFilterChange('maxLength', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Manga</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minBeam ?? ''}
                    onChange={(e) => onFilterChange('minBeam', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxBeam ?? ''}
                    onChange={(e) => onFilterChange('maxBeam', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Calado</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minDraft ?? ''}
                    onChange={(e) => onFilterChange('minDraft', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxDraft ?? ''}
                    onChange={(e) => onFilterChange('maxDraft', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Puntal</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minDepth ?? ''}
                    onChange={(e) => onFilterChange('minDepth', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxDepth ?? ''}
                    onChange={(e) => onFilterChange('maxDepth', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. CAPACIDADES */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenCapacidades(!openCapacidades)}>
            Capacidades
            {openCapacidades ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openCapacidades && (
            <div className={styles.sectionBody}>
              <h4 className={styles.subTitle}>Tripulante</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minCrewCapacity ?? ''}
                    onChange={(e) => onFilterChange('minCrewCapacity', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxCrewCapacity ?? ''}
                    onChange={(e) => onFilterChange('maxCrewCapacity', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Carga por Tn</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minCargoCapacityTonnes ?? ''}
                    onChange={(e) => onFilterChange('minCargoCapacityTonnes', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxCargoCapacityTonnes ?? ''}
                    onChange={(e) => onFilterChange('maxCargoCapacityTonnes', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Bodega</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minHoldCount ?? ''}
                    onChange={(e) => onFilterChange('minHoldCount', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxHoldCount ?? ''}
                    onChange={(e) => onFilterChange('maxHoldCount', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Combustible por Ltrs</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mín</label>
                  <input
                    type="number" min="0" placeholder="Ej: 20" className={styles.textInput}
                    value={filters.minMaxCapacityLiters ?? ''}
                    onChange={(e) => onFilterChange('minMaxCapacityLiters', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máx</label>
                  <input
                    type="number" min="0" placeholder="Ej: 40" className={styles.textInput}
                    value={filters.maxMaxCapacityLiters ?? ''}
                    onChange={(e) => onFilterChange('maxMaxCapacityLiters', e.target.value ? parseInt(e.target.value) : null)}
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

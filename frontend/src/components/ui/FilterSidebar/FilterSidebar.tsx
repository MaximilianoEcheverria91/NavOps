import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FilterSidebar.module.css';
import { MultiSelectSelect } from '../MultiSelectSelect/MultiSelectSelect';
import {
  PERSONAL_STATUSES,
  WORK_STATUSES,
  POSITIONS,
  ACCESS_STATUSES,
  SYSTEM_ROLES
} from '../../../types/userEnums';
import type { PersonnelFilterRequest } from '../../../services/api/filterService';

interface FilterSidebarProps {
  filters: PersonnelFilterRequest;
  onFilterChange: (key: keyof PersonnelFilterRequest, value: any) => void;
  onApply: () => void;
  onClear: () => void;
  countries: any[];
  provinces: any[];
  cities: any[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onApply,
  onClear,
  countries,
  provinces,
  cities
}) => {
  const [openPersonal, setOpenPersonal] = useState(true);
  const [openLabor, setOpenLabor] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>

        {/* DATOS PERSONALES */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenPersonal(!openPersonal)}>
            Datos Personales
            {openPersonal ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openPersonal && (
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
                  <option value="">Ej: Avellaneda</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Edad Mínima</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 20"
                    className={styles.textInput}
                    value={filters.minAge || ''}
                    onChange={(e) => onFilterChange('minAge', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Edad Máxima</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 40"
                    className={styles.textInput}
                    value={filters.maxAge || ''}
                    onChange={(e) => onFilterChange('maxAge', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>

              <MultiSelectSelect
                title="Estado"
                options={PERSONAL_STATUSES}
                selectedValues={filters.personalStatuses || []}
                onChange={(vals) => onFilterChange('personalStatuses', vals)}
                twoColumns
              />

            </div>
          )}
        </div>

        {/* DATOS LABORALES */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenLabor(!openLabor)}>
            Datos Laborales
            {openLabor ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openLabor && (
            <div className={styles.sectionBody}>

              <MultiSelectSelect
                title="Estado"
                options={WORK_STATUSES}
                selectedValues={filters.workStatuses || []}
                onChange={(vals) => onFilterChange('workStatuses', vals)}
                twoColumns
              />

              <MultiSelectSelect
                title="Posición"
                options={POSITIONS}
                selectedValues={filters.positions || []}
                onChange={(vals) => onFilterChange('positions', vals)}
                twoColumns
              />


              <h4 className={styles.subTitle}>Antigüedad (años)</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Mínima</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 3"
                    className={styles.textInput}
                    value={filters.minSeniority || ''}
                    onChange={(e) => onFilterChange('minSeniority', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Máxima</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 8"
                    className={styles.textInput}
                    value={filters.maxSeniority || ''}
                    onChange={(e) => onFilterChange('maxSeniority', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>

              <h4 className={styles.subTitle}>Fecha de ingreso</h4>
              <div className={styles.rowGrid}>
                <div className={styles.inputGroup}>
                  <label>Desde</label>
                  <input
                    type="date"
                    className={styles.textInput}
                    value={filters.entryDateFrom || ''}
                    onChange={(e) => onFilterChange('entryDateFrom', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Hasta</label>
                  <input
                    type="date"
                    className={styles.textInput}
                    value={filters.entryDateTo || ''}
                    onChange={(e) => onFilterChange('entryDateTo', e.target.value)}
                  />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ACCESO AL SISTEMA */}
        <div className={styles.section}>
          <h3 className={styles.sectionHeader} onClick={() => setOpenAccess(!openAccess)}>
            Acceso al Sistema
            {openAccess ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </h3>
          {openAccess && (
            <div className={styles.sectionBody}>

              <div className={styles.inputGroup}>
                <label>Tiene acceso al sistema</label>
                <select
                  className={styles.selectInput}
                  value={filters.hasSystemAccess?.toString() ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onFilterChange('hasSystemAccess', val === '' ? null : val === 'true');
                  }}
                >
                  <option value="">Ej: Todos</option>
                  <option value="true">Si</option>
                  <option value="false">No</option>
                </select>
              </div>

              <MultiSelectSelect
                title="Estado"
                options={ACCESS_STATUSES}
                selectedValues={filters.accessStatuses || []}
                onChange={(vals) => onFilterChange('accessStatuses', vals)}
              />

              <MultiSelectSelect
                title="Rol del sistema"
                options={SYSTEM_ROLES}
                selectedValues={filters.roles || []}
                onChange={(vals) => onFilterChange('roles', vals)}
              />

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

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Filter, Anchor, Edit2, Trash2, X } from 'lucide-react';
import { ShipDetailModal } from '../ShipDetailModal/ShipDetailModal';
import type { ShipStatus, ShipType } from '../../../types/ship';
import { useShipFilters } from '../../../hooks/useShipFilters';
import { ShipFilterSidebar } from '../../../components/ui/ShipFilterSidebar/ShipFilterSidebar';
import styles from './ListShips.module.css';
import { SHIP_STATUSES, SHIP_TYPES } from '../../../types/shipEnums';

const STATUS_LABELS: Record<ShipStatus | string, string> = {
  OPERATIONAL: 'Operativo',
  MAINTENANCE: 'Mantenimiento',
  REPAIR: 'Reparación',
  OUT_OF_SERVICE: 'Fuera de servicio',
  IN_PROGRESS: 'En Curso',
};

export const ListShips: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    filters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    loadMore,
    data,
    pagination,
    isFetching,
    errorMsg,
    countries
  } = useShipFilters();

  const filteredShips = data.filter((ship) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      ship.name.toLowerCase().includes(term) ||
      ship.registration.toLowerCase().includes(term) ||
      ship.imoNumber.toLowerCase().includes(term)
    );
  });

  const getActiveFilters = () => {
    const chips: { key: string, label: string, value: any, displayValue: string }[] = [];

    if (filters.countryId) {
      const c = countries.find((x: any) => x.id === filters.countryId);
      if (c) chips.push({ key: 'countryId', label: 'País', value: filters.countryId, displayValue: c.name });
    }

    if (filters.minBuildYear) chips.push({ key: 'minBuildYear', label: 'Año Mín.', value: filters.minBuildYear, displayValue: String(filters.minBuildYear) });
    if (filters.maxBuildYear) chips.push({ key: 'maxBuildYear', label: 'Año Máx.', value: filters.maxBuildYear, displayValue: String(filters.maxBuildYear) });
    
    if (filters.minLength) chips.push({ key: 'minLength', label: 'Eslora Mín.', value: filters.minLength, displayValue: `${filters.minLength}m` });
    if (filters.maxLength) chips.push({ key: 'maxLength', label: 'Eslora Máx.', value: filters.maxLength, displayValue: `${filters.maxLength}m` });
    
    if (filters.minBeam) chips.push({ key: 'minBeam', label: 'Manga Mín.', value: filters.minBeam, displayValue: `${filters.minBeam}m` });
    if (filters.maxBeam) chips.push({ key: 'maxBeam', label: 'Manga Máx.', value: filters.maxBeam, displayValue: `${filters.maxBeam}m` });
    
    if (filters.minDraft) chips.push({ key: 'minDraft', label: 'Calado Mín.', value: filters.minDraft, displayValue: `${filters.minDraft}m` });
    if (filters.maxDraft) chips.push({ key: 'maxDraft', label: 'Calado Máx.', value: filters.maxDraft, displayValue: `${filters.maxDraft}m` });

    if (filters.minDepth) chips.push({ key: 'minDepth', label: 'Puntal Mín.', value: filters.minDepth, displayValue: `${filters.minDepth}m` });
    if (filters.maxDepth) chips.push({ key: 'maxDepth', label: 'Puntal Máx.', value: filters.maxDepth, displayValue: `${filters.maxDepth}m` });

    if (filters.minCrewCapacity) chips.push({ key: 'minCrewCapacity', label: 'Tripulante Mín.', value: filters.minCrewCapacity, displayValue: String(filters.minCrewCapacity) });
    if (filters.maxCrewCapacity) chips.push({ key: 'maxCrewCapacity', label: 'Tripulante Máx.', value: filters.maxCrewCapacity, displayValue: String(filters.maxCrewCapacity) });

    if (filters.minCargoCapacityTonnes) chips.push({ key: 'minCargoCapacityTonnes', label: 'Carga Mín. (Tn)', value: filters.minCargoCapacityTonnes, displayValue: String(filters.minCargoCapacityTonnes) });
    if (filters.maxCargoCapacityTonnes) chips.push({ key: 'maxCargoCapacityTonnes', label: 'Carga Máx. (Tn)', value: filters.maxCargoCapacityTonnes, displayValue: String(filters.maxCargoCapacityTonnes) });

    if (filters.minHoldCount) chips.push({ key: 'minHoldCount', label: 'Bodega Mín.', value: filters.minHoldCount, displayValue: String(filters.minHoldCount) });
    if (filters.maxHoldCount) chips.push({ key: 'maxHoldCount', label: 'Bodega Máx.', value: filters.maxHoldCount, displayValue: String(filters.maxHoldCount) });

    if (filters.minMaxCapacityLiters) chips.push({ key: 'minMaxCapacityLiters', label: 'Combustible Mín. (L)', value: filters.minMaxCapacityLiters, displayValue: String(filters.minMaxCapacityLiters) });
    if (filters.maxMaxCapacityLiters) chips.push({ key: 'maxMaxCapacityLiters', label: 'Combustible Máx. (L)', value: filters.maxMaxCapacityLiters, displayValue: String(filters.maxMaxCapacityLiters) });

    filters.statuses?.forEach(st => {
      const found = SHIP_STATUSES.find(x => x.value === st);
      const label = found ? found.label : STATUS_LABELS[st] || st;
      chips.push({ key: `status_${st}`, label: 'Estado', value: st, displayValue: label });
    });

    filters.shipTypes?.forEach(st => {
      const found = SHIP_TYPES.find(x => x.value === st);
      const label = found ? found.label : st;
      chips.push({ key: `type_${st}`, label: 'Tipo', value: st, displayValue: label });
    });

    return chips;
  };

  const handleRemoveFilter = (chip: any) => {
    const newFilters = { ...filters };

    if (['countryId', 'minBuildYear', 'maxBuildYear', 'minLength', 'maxLength', 'minBeam', 'maxBeam', 'minDraft', 'maxDraft', 'minDepth', 'maxDepth', 'minCrewCapacity', 'maxCrewCapacity', 'minCargoCapacityTonnes', 'maxCargoCapacityTonnes', 'minHoldCount', 'maxHoldCount', 'minMaxCapacityLiters', 'maxMaxCapacityLiters'].includes(chip.key)) {
      (newFilters as any)[chip.key] = chip.key === 'countryId' ? '' : null;
    } else if (chip.key.startsWith('status_')) {
      newFilters.statuses = newFilters.statuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('type_')) {
      newFilters.shipTypes = newFilters.shipTypes?.filter(x => x !== chip.value) || [];
    }

    newFilters.page = 0;
    applyFilters(newFilters);
  };

  const activeFiltersChips = getActiveFilters();

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <header>
            <h1 className="text-3xl text-[var(--text-secondary)] font-medium">Gestión de Barcos</h1>
            <p className="text-slate-400 mt-1 text-sm">Bienvenido al sistema de gestión y Navegación</p>
          </header>
          <button className={styles.addButton} onClick={() => navigate('/barcos/nuevo')}>
            <Anchor size={24} />
            <span>+</span>
          </button>
        </div>

        <div className={styles.filtersContainer}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, matrícula o IMO..."
          />
          <button
            className={styles.filterDropdown}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Filter size={18} className={styles.filterIcon} />
            <span style={{ color: '#94a3b8' }}>
              Filtros {isSidebarOpen ? '∧' : '∨'}
            </span>
          </button>
        </div>

        {activeFiltersChips.length > 0 && (
          <div className={styles.activeFiltersContainer}>
            {activeFiltersChips.map(chip => (
              <div key={chip.key} className={styles.filterChip}>
                {chip.label}: <span>{chip.displayValue}</span>
                <button
                  className={styles.chipRemoveBtn}
                  onClick={() => handleRemoveFilter(chip)}
                  title="Quitar filtro"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button className={styles.clearFiltersBtn} onClick={resetFilters}>
              Limpiar
            </button>
          </div>
        )}

        <div className={styles.mainLayout}>

          <div className={styles.gridContainer}>
            {isFetching && data.length === 0 ? (
              <div className={styles.loading}>Cargando barcos...</div>
            ) : errorMsg ? (
              <div className="flex justify-center items-center py-20 text-center flex-col">
                <p className="text-red-400 text-lg mb-2">Ocurrió un error al cargar los datos.</p>
                <p className="text-slate-500 text-sm">Detalle: {errorMsg}.</p>
              </div>
            ) : filteredShips.length === 0 ? (
              <div className={styles.loading}>
                No se encontraron barcos con los filtros actuales.
              </div>
            ) : (
              <>
                <div className={styles.portsGrid}>
                  {filteredShips.map((ship) => (
                    <div key={ship.id} className={styles.shipCard}>
                      <div className={styles.imageContainer}>
                        {ship.mainImageUrl ? (
                          <img src={ship.mainImageUrl} alt={ship.name} className={styles.shipImage} />
                        ) : (
                          <Anchor size={48} color="rgba(14,165,233,0.4)" />
                        )}

                        <h3 className={styles.shipName}>
                          <Anchor size={24} color="var(--text-secondary)" />
                          {ship.name}
                        </h3>
                      </div>

                      <span className={`${styles.statusBadge} ${styles[`status${ship.status}`]}`}>
                        {STATUS_LABELS[ship.status] || ship.status}
                      </span>

                      <div className={styles.cardContent}>
                        <div className={styles.headerRow}>
                          <div className={styles.shipInfo}>
                            <div className={styles.shipMeta}>
                              <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Matrícula</span>
                                <span className={styles.metaValue}>{ship.registration}</span>
                              </div>
                              <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Número de IMO</span>
                                <span className={styles.metaValue}>{ship.imoNumber}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            className={styles.viewDetailBtn}
                            onClick={() => navigate(`/barcos/${ship.id}`)}
                          >
                            Ver detalle
                          </button>
                          <button className={styles.editBtn} 
                            title="Editar"
                            onClick={()=> navigate(`/barcos/edit/${ship.id}`)}
                            >
                            <Edit2 size={16} />
                          </button>
                          <button className={styles.deleteBtn} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.page + 1 < pagination.totalPages && (
                  <div className={styles.loadMoreContainer}>
                    <button
                      className={styles.loadMoreBtn}
                      onClick={loadMore}
                      disabled={isFetching}
                    >
                      {isFetching ? 'Cargando...' : 'Cargar más resultados'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {isSidebarOpen && (
            <ShipFilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={() => applyFilters()}
              onClear={resetFilters}
              countries={countries}
            />
          )}

        </div>

        {id && <ShipDetailModal shipId={id} onClose={() => navigate('/barcos')} />}

        <footer className="text-center mt-12 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>
      </div>
    </MainLayout>
  );
};

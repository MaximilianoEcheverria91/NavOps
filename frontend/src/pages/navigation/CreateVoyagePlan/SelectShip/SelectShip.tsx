import React, { useState, } from 'react';
import { SearchInput } from '../../../../components/ui/SearchInput/SearchInput';
import { Filter, Anchor, X, Check } from 'lucide-react';
import type { ShipStatus, ShipSummaryResponse } from '../../../../types/ship';
import { useShipFilters } from '../../../../hooks/useShipFilters';
import { ShipFilterSidebar } from '../../../../components/ui/ShipFilterSidebar/ShipFilterSidebar';
import styles from './SelectShip.module.css';
import { SHIP_STATUSES, SHIP_TYPES } from '../../../../types/shipEnums';
const STATUS_LABELS: Record<ShipStatus | string, string> = {
  OPERATIONAL: 'Operativo',
  MAINTENANCE: 'Mantenimiento',
  REPAIR: 'Reparación',
  OUT_OF_SERVICE: 'Fuera de servicio',
  IN_PROGRESS: 'En Curso',
};

interface SelectShipProps {
  onSelectShip: (shipId: string, shipData: any) => void;
  onCancel: () => void;
}



export const SelectShip: React.FC<SelectShipProps> = ({ onSelectShip, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);

  
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

 const handleSelect = (ship: ShipSummaryResponse) => {
    if (selectedShipId === ship.id) {
      setSelectedShipId(null); // Permite desmarcar si cambia de opinión
    } else {
      setSelectedShipId(ship.id);
    }
  };

 const handleSaveAndRedirect = () => {
    if (!selectedShipId) return;
    
    // 🚀 Buscamos el barco seleccionado
    const chosenShip = filteredShips.find(s => s.id === selectedShipId);
    if (chosenShip) {
      // A) Le pasamos los datos al estado del padre
      onSelectShip(chosenShip.id, chosenShip); 
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <header>
          <h1 className="text-3xl text-[var(--text-secondary)] font-medium">Selecciona el barco</h1>
          <p className="text-slate-400 mt-1 text-sm">Bienvenido al sistema de gestión y Navegación</p>
        </header>
        <div className={styles.actionHeader}>
        <button className={styles.backBtn} onClick={onCancel}>
          Volver
        </button>
        <button 
            className={`${styles.saveBtn} ${!selectedShipId ? styles.saveBtnDisabled : ''}`}
            disabled={!selectedShipId} // 🔴 Validación: deshabilitado si no hay selección
            onClick={handleSaveAndRedirect}
          >
            Guardar 
          </button>
          </div>
      </div>

      <div className={styles.filtersContainer}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Busca los barcos por origen, destino o ID..."
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
            <div className={styles.loading}>Cargando flota...</div>
          ) : errorMsg ? (
            <div className="flex justify-center items-center py-20 text-center flex-col">
              <p className="text-red-400 text-lg mb-2">Ocurrió un error al cargar los datos.</p>
              <p className="text-slate-500 text-sm">Detalle: {errorMsg}.</p>
            </div>
          ) : filteredShips.length === 0 ? (
            <div className={styles.loading}>
              No se encontraron barcos disponibles.
            </div>
          ) : (
            <>
              <div className={styles.portsGrid}>
                {filteredShips.map((ship) => {
                  const isSelected = selectedShipId === ship.id;
                  
                  let statusClass = '';
                  if (ship.status === 'MAINTENANCE') statusClass = styles.statusMAINTENANCE;
                  else if (ship.status === 'REPAIR') statusClass = styles.statusREPAIR;
                  else if (ship.status === 'OUT_OF_SERVICE') statusClass = styles.statusOUT_OF_SERVICE;
                  else if (ship.status === 'IN_TRANSIT') statusClass = styles.statusIN_PROGRESS;
                  else if (ship.status === 'OPERATIONAL') statusClass = styles.statusOPERATIONAL;

                  return (
                    <div key={ship.id} className={`${styles.shipCard} ${isSelected ? styles.cardSelected : ''}`}>
                      {isSelected && <div className={styles.cardSelectedOverlay}></div>}
                      
                      <div className={styles.imageContainer}>
                        {ship.mainImageUrl ? (
                          <img src={ship.mainImageUrl} alt={ship.name} className={styles.shipImage} />
                        ) : (
                          <Anchor size={48} color="rgba(56, 189, 248, 0.4)" />
                        )}
                        <span className={`${styles.statusBadge} ${statusClass}`}>
                          {STATUS_LABELS[ship.status] || ship.status || 'Disponible'}
                        </span>
                      </div>

                      <div className={styles.cardContent}>
                        <div className={styles.shipNameRow}>
                          <Anchor size={20} /> {ship.name}
                        </div>

                        <div className={styles.detailsList}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Tipo de Barco:</span>
                            <span className={styles.detailValue}>{SHIP_TYPES.find(t => t.value === ship.registration)?.label || ship.registration}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Modelo:</span>
                            <span className={styles.detailValue}>{ship.name}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Capacidad:</span>
                            <span className={styles.detailValue}>
                              {ship.imoNumber ? ship.imoNumber.toLocaleString() : 'N/A'} Toneladas
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className={styles.cardSelectedCheck}>
                            <Check size={28} strokeWidth={3} />
                          </div>
                        )}

                        <div className={styles.cardActions}>
                          <button className={styles.viewDetailBtn}
                            >
                            Ver detalle
                          </button>
                          <button 
                            className={styles.selectBtn} 
                            onClick={() => handleSelect(ship)}
                          >
                            {isSelected ? 'Seleccionado' : 'Seleccionar Barco'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    </div>
  );
};

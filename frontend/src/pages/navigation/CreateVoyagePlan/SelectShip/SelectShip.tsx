import React, { useState, useEffect } from 'react';
import { SearchInput } from '../../../../components/ui/SearchInput/SearchInput';
import { Anchor, Check, Filter, X } from 'lucide-react';
import type { ShipStatus, ShipActiveSelect } from '../../../../types/ship';
import { getAllActiveShips } from '../../../../services/api/shipService';
import styles from './SelectShip.module.css';
import { SHIP_STATUSES, SHIP_TYPES } from '../../../../types/shipEnums';
import { ShipFilterSidebar } from '../../../../components/ui/ShipFilterSidebar/ShipFilterSidebar';
import { ShipDetailModal } from '../../../ships/ShipDetailModal/ShipDetailModal';
import { ConfirmModal } from '../../../../components/ui/ConfirmModal/ConfirmModal';

const STATUS_LABELS: Record<ShipStatus | string, string> = {
  OPERATIONAL: 'Operativo',
  MAINTENANCE: 'Mantenimiento',
  REPAIR: 'Reparación',
  OUT_OF_SERVICE: 'Fuera de servicio',
  IN_PROGRESS: 'En Curso',
  IN_TRANSIT: 'En Tránsito'
};

interface SelectShipProps {
  onSelectShip: (shipId: string, shipData: any) => void;
  onCancel: () => void;
  selectedShipId?: string | null;
}

export const SelectShip: React.FC<SelectShipProps> = ({ onSelectShip, onCancel, selectedShipId: initialShipId}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipId, setSelectedShipId] = useState<string | null>(initialShipId || null);
  const [isShipDetailOpen, setIsShipDetailOpen] = useState<boolean>(false);
  const [focusedShipId, setFocusedShipId] = useState<string | null>(null);
  const [isLeaveAlertOpen, setIsLeaveAlertOpen] = useState<boolean>(false);

  const [data, setData] = useState<ShipActiveSelect[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    countryId: '',
    shipTypes: [] as string[],
    statuses: [] as string[]
  });

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

  /*  const handlePopState = (event: PopStateEvent) => {
      // 2. Si el usuario presiona la flecha "Atrás", cancelamos la salida de la URL...
      event.preventDefault();

      // 3. ...y ejecutamos el callback nativo que cierra la pantalla y vuelve a las 4 cards sanas y salvas
      onCancel();
    };

    // Escuchamos el botón atrás del navegador
    window.addEventListener('popstate', handlePopState);

    // Limpieza al desmontar el componente (Clean-up)
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  */

    const fetchShips = async () => {
      setIsFetching(true);
      setErrorMsg(null);
      try {
        const activeShips = await getAllActiveShips();
        setData(activeShips);
      } catch (error) {
        setErrorMsg('No se pudieron cargar los barcos disponibles');
      } finally {
        setIsFetching(false);
      }
    };
    fetchShips();
  }, []);

  // 🛡️ CONTROL DE HISTORIAL SENIOR: Evita que la flecha "Atrás" destruya el asistente
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();

      // 🚀 Si el usuario cambió o desmarcó el barco original, advertimos antes de salir
      if (selectedShipId !== initialShipId) {
        window.history.pushState(null, '', window.location.href); // Bloquea la navegación
        setIsLeaveAlertOpen(true); // Abre el modal
      } else {
        onCancel(); // Vuelve directo a las 4 cards limpio
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedShipId, initialShipId, onCancel]);

  const filteredShips = data.filter((ship) => {
    // 1. Filtro por búsqueda (searchTerm)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = ship.name.toLowerCase().includes(term);
      const matchReg = ship.registration.toLowerCase().includes(term);
      if (!matchName && !matchReg) return false;
    }

    // 2. Filtro por tipo de barco (shipTypes)
    if (filters.shipTypes.length > 0) {
      if (!filters.shipTypes.includes(ship.shipType)) return false;
    }

    // 3. Filtro por estado (statuses)
    if (filters.statuses.length > 0) {
      if (!filters.statuses.includes(ship.status)) return false;
    }

    return true;
  });

  const getActiveFilters = () => {
    const chips: { key: string, label: string, value: any, displayValue: string }[] = [];

    filters.statuses.forEach(st => {
      const found = SHIP_STATUSES.find(x => x.value === st);
      const label = found ? found.label : STATUS_LABELS[st] || st;
      chips.push({ key: `status_${st}`, label: 'Estado', value: st, displayValue: label });
    });

    filters.shipTypes.forEach(st => {
      const found = SHIP_TYPES.find(x => x.value === st);
      const label = found ? found.label : st;
      chips.push({ key: `type_${st}`, label: 'Tipo', value: st, displayValue: label });
    });

    return chips;
  };

  const handleRemoveFilter = (chip: any) => {
    if (chip.key.startsWith('status_')) {
      setFilters(prev => ({ ...prev, statuses: prev.statuses.filter(x => x !== chip.value) }));
    } else if (chip.key.startsWith('type_')) {
      setFilters(prev => ({ ...prev, shipTypes: prev.shipTypes.filter(x => x !== chip.value) }));
    }
  };

  const activeFiltersChips = getActiveFilters();

  const handleSelect = (ship: ShipActiveSelect) => {
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
    if (chosenShip && chosenShip.status === 'OPERATIONAL') {
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
          <button className={styles.backBtn} 
            onClick={() => {
                if (selectedShipId !== initialShipId) {
                  setIsLeaveAlertOpen(true);
                } else {
                  onCancel();
                }
              }}>
            Volver
          </button>
          <button 
            className={`${styles.saveBtn} ${!selectedShipId ? styles.saveBtnDisabled : ''}`}
            disabled={!selectedShipId}
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
          placeholder="Busca los barcos por nombre o patente..."
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
          <button 
            className={styles.clearFiltersBtn} 
            onClick={() => setFilters({ countryId: '', shipTypes: [], statuses: [] })}
          >
            Limpiar
          </button>
        </div>
      )}

      <div className={styles.mainLayout}>
        <div className={styles.gridContainer}>
          {isFetching ? (
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
                            <span className={styles.detailValue}>{SHIP_TYPES.find(t => t.value === ship.shipType)?.label || ship.shipType}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>N° de Patente:</span>
                            <span className={styles.detailValue}>{ship.registration}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Capacidad:</span>
                            <span className={styles.detailValue}>
                              {ship.crewCapacity != null ? `${ship.crewCapacity} Tripulantes` : 'N/A'}
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
                            onClick={(e) => {
                              e.stopPropagation(); // 🛑 Evita que se dispare el click de selección de tarjeta
                              setFocusedShipId(ship.id); // 🚀 Guardamos el ID del barco clickeado
                              setIsShipDetailOpen(true);
                            }}>
                            Ver detalle
                          </button>

                          
                          <button
                              className={`${styles.selectBtn} ${ship.status !== 'OPERATIONAL' ? styles.selectBtnDisabled : ''}`}
                              onClick={() => ship.status === 'OPERATIONAL' && handleSelect(ship)}
                              disabled={ship.status !== 'OPERATIONAL'}
                              title={ship.status !== 'OPERATIONAL' ? "Solo se pueden seleccionar barcos en estado Operativo" : undefined}
                          >
                            {ship.status !== 'OPERATIONAL' ? 'No Disponible' : isSelected ? 'Seleccionado' : 'Seleccionar Barco'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          
        </div>
        {isSidebarOpen && (
          <ShipFilterSidebar
            filters={filters as any}
            onFilterChange={(key, value) => {
              setFilters(prev => ({ ...prev, [key]: value }));
            }}
            onApply={() => setIsSidebarOpen(false)}
            onClear={() => setFilters({ countryId: '', shipTypes: [], statuses: [] })}
            countries={[]}
          />
        )}
      </div>

      {isShipDetailOpen && focusedShipId && (
        <ShipDetailModal
          shipId={focusedShipId}
          onClose={() => {
            setIsShipDetailOpen(false);
            setFocusedShipId(null); // Reseteamos el puntero al cerrar
          }}
          showActions={false} // 🛡️ ¡Acá aplicamos tu magia! Oculta botones de alta/baja
        />
      )}

      <ConfirmModal
        isOpen={isLeaveAlertOpen}
        title="¿Desea salir de la selección de barco?"
        description="Si sales ahora, se descartarán los cambios de selección que hayas realizado en la flota para este viaje operativo."
        onConfirm={() => {
          setIsLeaveAlertOpen(false);
          onCancel(); // Ejecuta el callback del padre y te regresa directo a las 4 cards sin romper el wizard
        }}
        onCancel={() => setIsLeaveAlertOpen(false)} // Cierra el cartel y te deja en la grilla
      />
    </div>
  );
};

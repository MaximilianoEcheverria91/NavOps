import React, { useState } from 'react';
import { SearchInput } from '../../../../components/ui/SearchInput/SearchInput';
import { User, Check, X, Users, AlertCircle, Filter, Clock } from 'lucide-react';
import { usePersonnelFilters } from '../../../../hooks/usePersonnelFilters';
import { FilterSidebar } from '../../../../components/ui/FilterSidebar/FilterSidebar';
import { POSITIONS, PERSONAL_STATUSES, WORK_STATUSES, ACCESS_STATUSES, SYSTEM_ROLES } from '../../../../types/userEnums';
import styles from './SelectCrew.module.css';
import { AlertModal } from '../../../../components/ui/AlertModal/AlertModal';
import { UserDetailModal } from '../../../Users/DetailUser/UserDetailModal';

interface SelectCrewProps {
  onSelectCrew: (crewIds: string[]) => void;
  onCancel: () => void;
  crewCapacity?: number;
  initialSelectedIds?: string[];
}

export const SelectCrew: React.FC<SelectCrewProps> = ({ 
  onSelectCrew, 
  onCancel,
  crewCapacity = 100,
  initialSelectedIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCrewIds, setSelectedCrewIds] = useState<string[]>(initialSelectedIds);
  const isCrewLimitExceeded = selectedCrewIds.length > crewCapacity;
  const [isOverloadAlertOpen, setIsOverloadAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    filters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    countries,
    provinces,
    cities,
    data,
    isFetching,
    errorMsg,
    loadMore,
    pagination
  } = usePersonnelFilters();

  // Filtrado local rápido
  const filteredUsers = data.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.surname?.toLowerCase().includes(term) ||
      user.fileNumber?.toLowerCase().includes(term)
    );
  });

  const toggleCrewSelection = (id: string) => {
    setSelectedCrewIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Remover directamente desde la lista lateral usando la cruz
  const handleRemoveFromList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita cualquier disparo extraño de eventos
    setSelectedCrewIds(prev => prev.filter(cId => cId !== id));
  };

  const getActiveFilters = () => {
    const chips: { key: string, label: string, value: any, displayValue: string }[] = [];
    
    if (filters.countryId) {
      const c = countries.find((x: any) => x.id === filters.countryId);
      if (c) chips.push({ key: 'countryId', label: 'País', value: filters.countryId, displayValue: c.name });
    }
    if (filters.provinceId) {
      const p = provinces.find((x: any) => x.id === filters.provinceId);
      if (p) chips.push({ key: 'provinceId', label: 'Provincia', value: filters.provinceId, displayValue: p.name });
    }
    if (filters.cityId) {
      const c = cities.find((x: any) => x.id === filters.cityId);
      if (c) chips.push({ key: 'cityId', label: 'Ciudad', value: filters.cityId, displayValue: c.name });
    }
    if (filters.minAge) chips.push({ key: 'minAge', label: 'Edad Mín.', value: filters.minAge, displayValue: String(filters.minAge) });
    if (filters.maxAge) chips.push({ key: 'maxAge', label: 'Edad Máx.', value: filters.maxAge, displayValue: String(filters.maxAge) });
    if (filters.minSeniority) chips.push({ key: 'minSeniority', label: 'Antigüedad Mín.', value: filters.minSeniority, displayValue: String(filters.minSeniority) });
    if (filters.maxSeniority) chips.push({ key: 'maxSeniority', label: 'Antigüedad Máx.', value: filters.maxSeniority, displayValue: String(filters.maxSeniority) });
    
    filters.personalStatuses?.forEach(st => {
      const label = PERSONAL_STATUSES.find(x => x.value === st)?.label || st;
      chips.push({ key: `personalStatus_${st}`, label: 'Estado', value: st, displayValue: label });
    });

    filters.workStatuses?.forEach(st => {
      const label = WORK_STATUSES.find(x => x.value === st)?.label || st;
      chips.push({ key: `workStatus_${st}`, label: 'Estado Laboral', value: st, displayValue: label });
    });

    filters.positions?.forEach(pos => {
      const label = POSITIONS.find(x => x.value === pos)?.label || pos;
      chips.push({ key: `position_${pos}`, label: 'Posición', value: pos, displayValue: label });
    });

    if (filters.entryDateFrom) chips.push({ key: 'entryDateFrom', label: 'Ingreso Desde', value: filters.entryDateFrom, displayValue: filters.entryDateFrom });
    if (filters.entryDateTo) chips.push({ key: 'entryDateTo', label: 'Ingreso Hasta', value: filters.entryDateTo, displayValue: filters.entryDateTo });

    if (filters.hasSystemAccess !== null && filters.hasSystemAccess !== undefined) {
      chips.push({ key: 'hasSystemAccess', label: 'Acceso Sistema', value: filters.hasSystemAccess, displayValue: filters.hasSystemAccess ? 'Sí' : 'No' });
    }

    filters.accessStatuses?.forEach(st => {
      const label = ACCESS_STATUSES.find(x => x.value === st)?.label || st;
      chips.push({ key: `accessStatus_${st}`, label: 'Estado Acceso', value: st, displayValue: label });
    });

    filters.roles?.forEach(role => {
      const label = SYSTEM_ROLES.find(x => x.value === role)?.label || role;
      chips.push({ key: `role_${role}`, label: 'Rol', value: role, displayValue: label });
    });

    return chips;
  };

  const handleRemoveFilter = (chip: any) => {
    const newFilters = { ...filters };
    if (['countryId', 'provinceId', 'cityId', 'minAge', 'maxAge', 'minSeniority', 'maxSeniority', 'entryDateFrom', 'entryDateTo'].includes(chip.key)) {
      (newFilters as any)[chip.key] = chip.key.includes('Age') ? null : '';
      if (chip.key === 'countryId') {
        newFilters.provinceId = '';
        newFilters.cityId = '';
      } else if (chip.key === 'provinceId') {
        newFilters.cityId = '';
      }
    } else if (chip.key === 'hasSystemAccess') {
      newFilters.hasSystemAccess = null;
    } else if (chip.key.startsWith('personalStatus_')) {
      newFilters.personalStatuses = newFilters.personalStatuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('workStatus_')) {
      newFilters.workStatuses = newFilters.workStatuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('position_')) {
      newFilters.positions = newFilters.positions?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('accessStatus_')) {
      newFilters.accessStatuses = newFilters.accessStatuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('role_')) {
      newFilters.roles = newFilters.roles?.filter(x => x !== chip.value) || [];
    }
    
    newFilters.page = 0;
    applyFilters(newFilters);
  };

  const selectedCrew = data.filter(u => selectedCrewIds.includes(u.id));

  const activeFiltersChips = getActiveFilters();
  
  // 🚀 ESTRATEGIA DEFINITIVA: Recuperamos las posiciones mapeadas de forma directa
  // Filtramos los usuarios visibles que están seleccionados
  const currentVisibleSelected = data.filter(u => selectedCrewIds.includes(u.id));

  // 🛡️ VALIDACIÓN BLINDADA: Evaluamos las posiciones ignorando mayúsculas/minúsculas y asegurando que si el ID existe, el rol cuente.
  const hasCaptain = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'CAPTAIN') || 
                     currentVisibleSelected.some(u => u.position?.toUpperCase() === 'CAPTAIN');
                     
  const hasFirstOfficer = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'FIRST_OFFICER') || 
                          currentVisibleSelected.some(u => u.position?.toUpperCase() === 'FIRST_OFFICER');
                          
  const hasChiefEngineer = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'CHIEF_ENGINEER') || 
                           currentVisibleSelected.some(u => u.position?.toUpperCase() === 'CHIEF_ENGINEER');
                           
  const hasSecondOfficer = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'SECOND_OFFICER') || 
                           currentVisibleSelected.some(u => u.position?.toUpperCase() === 'SECOND_OFFICER');
                           
  const hasThirdOfficer = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'THIRD_OFFICER') || 
                          currentVisibleSelected.some(u => u.position?.toUpperCase() === 'THIRD_OFFICER');
                          
  const hasBoatswain = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'BOATSWAIN') || 
                       currentVisibleSelected.some(u => u.position?.toUpperCase() === 'BOATSWAIN');
                       
  const hasHelmsman = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'HELMSMAN') || 
                      currentVisibleSelected.some(u => u.position?.toUpperCase() === 'HELMSMAN');
                      
  const hasEngOfficers = data.some(u => selectedCrewIds.includes(u.id) && u.position?.toUpperCase() === 'ENGINEERING_OFFICERS') || 
                         currentVisibleSelected.some(u => u.position?.toUpperCase() === 'ENGINEERING_OFFICERS');

  const missingCriticalRoles = [
    !hasCaptain && 'Capitán',
    !hasFirstOfficer && 'Primer Oficial',
    !hasSecondOfficer && 'Segundo Oficial',
    !hasThirdOfficer && 'Tercer Oficial',
    !hasBoatswain && 'Contramaestre',
    !hasHelmsman && 'Timonel',
    !hasChiefEngineer && 'Jefe de Máquinas',
    !hasEngOfficers && 'Oficiales de Máquina'
  ].filter(Boolean) as string[];

  const isSaveEnabled = missingCriticalRoles.length === 0;

  const handleSaveAndClose = () => {
    // 🛑 CONTROL DE EXCESO DE PERSONAL
    if (selectedCrewIds.length > crewCapacity) {
      setIsOverloadAlertOpen(true);
      return;
    }

    if (isSaveEnabled) {
      onSelectCrew(selectedCrewIds);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* HEADER ROW - Limpio de doble guardado */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Nueva Tripulación</h1>
          <p className={styles.subtitle}>Asigna personal para el viaje. Los roles críticos son obligatorios.</p>
        </div>
        <div className={styles.actionHeader}>
          {/* 🚀 Dejamos solo Volver / Cancelar arriba de manera elegante */}
          <button className={styles.backBtn} onClick={onCancel}>
            Cancelar y Volver
          </button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          <div className={styles.filtersContainer}>
            <div className={styles.searchWrapper}>
              <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por nombre, legajo o posición..."
              />
            </div>
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

          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {isFetching && data.length === 0 ? (
              <div className={styles.loading}>Cargando tripulantes...</div>
            ) : errorMsg ? (
              <div className={styles.loading} style={{ color: '#ef4444' }}>Error: {errorMsg}</div>
            ) : filteredUsers.length === 0 ? (
              <div className={styles.loading}>No se encontraron tripulantes.</div>
            ) : (
              <>
                <div className={styles.grid}>
                  {filteredUsers.map((user) => {
                    const isSelected = selectedCrewIds.includes(user.id);
                    const positionLabel = POSITIONS.find(p => p.value === user.position || p.value === user.position?.toUpperCase())?.label || user.position;
                    
                    return (
                      <div 
                        key={user.id} 
                        className={`${styles.userCard} ${isSelected ? styles.userCardSelected : ''}`}
                        onClick={() => toggleCrewSelection(user.id)}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.avatarWrapper}>
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
                            ) : (
                              <div className={styles.avatarPlaceholder}>
                                <User size={32} />
                              </div>
                            )}
                            {isSelected && (
                              <div className={styles.selectedCheck}>
                                <Check size={16} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          
                          <div className={styles.userInfo}>
                            <h3 className={styles.userName}>{user.name} {user.surname}</h3>
                            <p className={styles.userRole}>{positionLabel}</p>
                            <div className={styles.detailItem}>
                              <User size={12} /> Legajo: <strong style={{ color: 'var(--text-secondary, #fff)', fontWeight: 500 }}>{user.fileNumber}</strong>
                            </div>
                            <div className={styles.detailItem}>
                              <Clock size={12} className={styles.detailIcon} />
                              <span>Antigüedad: <strong style={{ color: 'var(--text-secondary, #fff)', fontWeight: 500 }}> {user.yearsOfService} años</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.tagsContainer}>
                          {user.systemRole && (
                            <span className={styles.tag}>Rol: {SYSTEM_ROLES.find(r => r.value === user.systemRole)?.label || user.systemRole}</span>
                          )}
                          <span className={styles.tag}>Libreta: {user.maritimeBookNumber}</span>
                        </div>

                        <div className={styles.cardFooter}>
                          <button className={styles.viewDetailsBtn} 
                            onClick={(e) => {
                              e.stopPropagation(); // Evita que se seleccione/deseleccione el usuario de la tripulación
                              setSelectedUserId(user.id);
                            }}>
                            Ver detalles completos →
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {selectedUserId && (
                    <UserDetailModal 
                      userId={selectedUserId} 
                      onClose={() => setSelectedUserId(null)} 
                    />
                  )}

                  {selectedUserId && (
                    <UserDetailModal 
                      userId={selectedUserId} 
                      onClose={() => setSelectedUserId(null)} 
                      showActions={false} // 🚀 ¡Magia! Acá le apagamos los botones de editar y borrar
                    />
                  )}
                  
                </div>

                {pagination.page + 1 < pagination.totalPages && (
                  <div className={styles.loadMoreContainer}>
                    <button className={styles.loadMoreBtn} onClick={loadMore} disabled={isFetching}>
                      {isFetching ? 'Cargando...' : 'Cargar más resultados'}
                    </button>
                  </div>
                )}
              </>
            )}

            {isSidebarOpen && (
              <FilterSidebar 
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={() => { applyFilters(); setIsSidebarOpen(false); }}
                onClear={() => { resetFilters(); setIsSidebarOpen(false); }}
                countries={countries}
                provinces={provinces}
                cities={cities}
              />
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Con Alerta Dinámica de Color */}
        <div className={styles.rightPanel}>
          <h2 className={styles.panelTitle}>
            <Users size={20} color="#38bdf8" /> Resumen de Tripulación
          </h2>
          <p className={styles.panelSubtitle}>Validación de roles y personal</p>

          {/* 🚀 Inyección de clase dinámica basada en si los roles están listos o no */}
          <div className={`${styles.warningBox} ${isSaveEnabled ? styles.warningBoxSuccess : ''}`}>
            <div className={styles.warningBoxHeader}>
              {isSaveEnabled ? <Check size={18} /> : <AlertCircle size={18} />} 
              {isSaveEnabled ? 'Cumplimiento Exitoso' : 'Roles críticos requeridos'}
            </div>
            
            {missingCriticalRoles.length > 0 ? (
              <>
                <p className={styles.warningBoxText}>
                  Faltan asignar los siguientes roles operativos:
                </p>
                <div className={styles.criticalRolesList}>
                  {!hasCaptain && <span className={styles.criticalRoleTag}>Capitán <X size={12}/></span>}
                  {!hasFirstOfficer && <span className={styles.criticalRoleTag}>1° Oficial <X size={12}/></span>}
                  {!hasSecondOfficer && <span className={styles.criticalRoleTag}>2° Oficial <X size={12}/></span>}
                  {!hasThirdOfficer && <span className={styles.criticalRoleTag}>3° Oficial <X size={12}/></span>}
                  {!hasBoatswain && <span className={styles.criticalRoleTag}>Contramaestre <X size={12}/></span>}
                  {!hasHelmsman && <span className={styles.criticalRoleTag}>Timonel <X size={12}/></span>}
                  {!hasChiefEngineer && <span className={styles.criticalRoleTag}>Jefe Máq. <X size={12}/></span>}
                  {!hasEngOfficers && <span className={styles.criticalRoleTag}>Of. Máquina <X size={12}/></span>}
                </div>
              </>
            ) : (
              <p className={styles.warningBoxTextSuccess}>
                ¡Excelente! Flota de tripulación completa y validada de forma reglamentaria para zarpar.
              </p>
            )}
          </div>
            
            <div className={styles.assignedSectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className={styles.assignedTitle} style={{ margin: 0 }}>Tripulación Asignada</h3>
            
            {/* 🚀 BADGE DINÁMICO IDÉNTICO A Badge.png CON REACCIÓN DE COLOR */}
            <div 
              style={{
                backgroundColor: isCrewLimitExceeded ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 211, 238, 0.1)',
                borderColor: isCrewLimitExceeded ? '#ef4444' : '#22d3ee',
                color: isCrewLimitExceeded ? '#ef4444' : '#22d3ee',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '9999px',
                padding: '4px 14px',
                fontSize: '11px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {isCrewLimitExceeded && <span>⚠️</span>}
              {selectedCrewIds.length}/{crewCapacity} miembros
            </div>
          </div>

          <AlertModal
            isOpen={isOverloadAlertOpen}
            title={`CAPACIDAD EXCEDIDA. Tenés una sobrecarga de ${(selectedCrewIds.length - crewCapacity)} personas. Supera el límite de camarotes del barco:`}
            highlightText={`${crewCapacity} tripulantes máximos`}
            buttonText="Aceptar"
            onClose={() => setIsOverloadAlertOpen(false)}
          />

          <div className={styles.assignedList}>
            {selectedCrew.length === 0 ? (
              <div className={styles.emptyState}>
                <Users size={32} className={styles.emptyStateIcon} />
                <div>
                  <p className={styles.emptyStateText}>No hay tripulación seleccionada</p>
                  <p className={styles.emptyStateSubtext}>Haz clic en las cards para agregar personal</p>
                </div>
              </div>
            ) : (
              selectedCrew.map(user => {
                const posLabel = POSITIONS.find(p => p.value === user.position || p.value === user.position?.toUpperCase())?.label || user.position;
                return (
                  <div key={user.id} className={styles.assignedItem}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className={styles.assignedItemAvatar} />
                    ) : (
                      <div className={styles.assignedItemAvatar} style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                        <User size={16} />
                      </div>
                    )}
                    <div className={styles.assignedItemInfo}>
                      <h4 className={styles.assignedItemName}>{user.name} {user.surname}</h4>
                      <span className={styles.assignedItemRole}>{posLabel}</span>
                    </div>
                    {/* 🚀 AGREGAMOS LA CRUZ DE ELIMINACIÓN RÁPIDA DIRECTA */}
                    <button 
                      className={styles.removeCrewBtn} 
                      onClick={(e) => handleRemoveFromList(user.id, e)}
                      title="Quitar de la lista"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div className={styles.bottomAction}>
            <button 
              className={`${styles.saveBtn} ${!isSaveEnabled ? styles.saveBtnDisabled : ''}`}
              style={{ width: '100%', padding: '12px' }}
              disabled={!isSaveEnabled}
              onClick={handleSaveAndClose}
            >
              Guardar y Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
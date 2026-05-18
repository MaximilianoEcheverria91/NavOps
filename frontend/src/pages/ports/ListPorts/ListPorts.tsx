// src/pages/ports/ListPorts/PortsList.tsx
import React, { useState } from 'react';
import { MainLayout } from '../../../layouts/MainLayout';
import { Filter, Anchor, Edit2, Trash2, X } from 'lucide-react';
import styles from './ListPorts.module.css'; 
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { useNavigate } from 'react-router-dom';
import { PortFilterSidebar } from '../../../components/ui/PortFilterSidebar/PortFilterSidebar';
import { usePortFilters } from '../../../hooks/usePortFilters';
import { PortDetailModal } from "../DetailPort/PortDetailModal.tsx";
import DeletePortModal from '../DeletePortModal/DeletePortModal';
import ReactivatePortModal from '../../../components/ui/ReactivatePortModal/ReactivatePortModal';

export const ListPorts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modales de control de estado local que tenías originalmente
  const [portToDelete, setPortToDelete] = useState<{
    id: string;
    name: string;
    location: string;
    imageUrl?: string;
  } | null>(null);

  const [portToReactivate, setPortToReactivate] = useState<{
    id: string;
    name: string;
    location: string;
    imageUrl?: string;
  } | null>(null);
  
  const navigate = useNavigate();

  // Acople del Hook Avanzado por POST
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
    countries,
    provinces,
    cities
  } = usePortFilters();

  const filteredPorts = data.filter((port) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      port.name?.toLowerCase().includes(term) ||
      port.code?.toLowerCase().includes(term) ||
      port.countryName?.toLowerCase().includes(term) ||
      port.provinceName?.toLowerCase().includes(term) ||
      port.cityName?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return <span className={`${styles.statusBadge} ${styles.statusOPERATIONAL}`}>OPERATIVO</span>;
      case 'UNDER_MAINTENANCE':
        return <span className={`${styles.statusBadge} ${styles.statusUNDER_MAINTENANCE}`}>MANTENIMIENTO</span>;
      case 'INACTIVE':
        return <span className={`${styles.statusBadge} ${styles.statusINACTIVE}`}>INACTIVO</span>;
      case 'CLOSED':
        return <span className={`${styles.statusBadge} ${styles.statusCLOSED}`}>CERRADO</span>;
      case 'FULL':
        return <span className={`${styles.statusBadge} ${styles.statusFULL}`}>MUELLE COMPLETO</span>;
      default:
        return <span className={styles.statusBadge}>{status || 'DESCONOCIDO'}</span>;
    }
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
    if (filters.minDockCount) chips.push({ key: 'minDockCount', label: 'Muelles Mín.', value: filters.minDockCount, displayValue: String(filters.minDockCount) });
    if (filters.maxDockCount) chips.push({ key: 'maxDockCount', label: 'Muelles Máx.', value: filters.maxDockCount, displayValue: String(filters.maxDockCount) });
    if (filters.minMaxLength) chips.push({ key: 'minMaxLength', label: 'Eslora Mín.', value: filters.minMaxLength, displayValue: `${filters.minMaxLength}m` });
    if (filters.maxMaxLength) chips.push({ key: 'maxMaxLength', label: 'Eslora Máx.', value: filters.maxMaxLength, displayValue: `${filters.maxMaxLength}m` });
    if (filters.minMaxDraft) chips.push({ key: 'minMaxDraft', label: 'Calado Mín.', value: filters.minMaxDraft, displayValue: `${filters.minMaxDraft}m` });
    if (filters.maxMaxDraft) chips.push({ key: 'maxMaxDraft', label: 'Calado Máx.', value: filters.maxMaxDraft, displayValue: `${filters.maxMaxDraft}m` });
    
    filters.statuses?.forEach(st => {
      let label :string = st;
      if (st === 'OPERATIONAL') label = 'Operativo';
      if (st === 'UNDER_MAINTENANCE') label = 'En Mantenimiento';
      if (st === 'INACTIVE') label = 'Inactivo';
      if (st === 'CLOSED') label = 'Cerrado';
      if (st === 'FULL') label = 'Muelle Completo';
      chips.push({ key: `status_${st}`, label: 'Estado', value: st, displayValue: label });
    });

    return chips;
  };

  const handleRemoveFilter = (chip: any) => {
    const newFilters = { ...filters };
    
    if (['countryId', 'provinceId', 'cityId', 'minDockCount', 'maxDockCount', 'minMaxLength', 'maxMaxLength', 'minMaxDraft', 'maxMaxDraft'].includes(chip.key)) {
      (newFilters as any)[chip.key] = chip.key.includes('Count') || chip.key.includes('Length') || chip.key.includes('Draft') ? null : '';
      if (chip.key === 'countryId') {
        newFilters.provinceId = '';
        newFilters.cityId = '';
      } else if (chip.key === 'provinceId') {
        newFilters.cityId = '';
      }
    } else if (chip.key.startsWith('status_')) {
      newFilters.statuses = newFilters.statuses?.filter(x => x !== chip.value) || [];
    }
    
    newFilters.page = 0;
    applyFilters(newFilters);
  };

  const activeFiltersChips = getActiveFilters();

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <header>
            <h1 className="text-3xl text-[var(--text-secondary)] font-medium"> 
              Gestión de Puertos
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Bienvenido al sistema de gestión y Navegación
            </p>
          </header>
          
          <button className={styles.addButton} onClick={() => navigate('/puertos/create')}>
            <Anchor size={24} />
            <span className={styles.plusIcon}>+</span>
          </button>
        </div>

        {/* TOP BAR */}
        <div className={styles.filtersContainer}>
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre y código ..."
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

        {/* ACTIVE FILTERS CHIPS */}
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

        {/* MAIN LAYOUT (GRID + SIDEBAR) */}
        <div className={styles.mainLayout}>
          
          <div className={styles.gridContainer}>
            {isFetching && data.length === 0 ? (
              <div className={styles.loading}>Cargando puertos...</div>
            ) : errorMsg ? (
              <div className="flex justify-center items-center py-20 text-center flex-col">
                <p className="text-red-400 text-lg mb-2">Ocurrió un error al cargar los datos.</p>
                <p className="text-slate-500 text-sm">Detalle: {errorMsg}.</p>
              </div>
            ) : filteredPorts.length === 0 ? (
              <div className={styles.loading}>
                No se encontraron puertos con los filtros actuales.
              </div>
            ) : (
              <>
                <div className={styles.portsGrid}>
                  {filteredPorts.map((port) => (
                    <div key={port.id} className={styles.portCard}>
                      
                      <div className={styles.imageContainer}>
                        {port.mainImageUrl ? (
                          <img src={port.mainImageUrl} alt={port.name} className={styles.portImage} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                            <Anchor size={48} />
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.cardContent}>
                        <div className={styles.headerRow}>
                          <div className={styles.portInfo}>
                            <h3 className={styles.portName}>{port.name}</h3>
                            <p className={styles.portLocation}>
                              {port.provinceName}, {port.countryName}
                            </p>
                          </div>
                          {getStatusBadge(port.status)}
                        </div>

                        <div className={styles.cardActions}>
                          <button className={styles.viewDetailBtn} onClick={() => { setSelectedPortId(port.id); setIsModalOpen(true); }}>
                            Ver detalle
                          </button>

                          {port.status === 'INACTIVE' && port.isActive === false ? (
                            <button 
                              className={styles.reactivateBtn} 
                              onClick={() => setPortToReactivate({
                                id: port.id,
                                name: port.name,
                                location: `${port.provinceName}, ${port.countryName}`,
                                imageUrl: port.mainImageUrl ?? undefined,
                              })}
                            >
                              Dar de alta
                            </button>
                          ) : (
                            <div className={styles.iconBtns}>
                              <button className={styles.editBtn} onClick={() => navigate(`/puertos/edit/${port.id}`)}>
                                <Edit2 size={16} />
                              </button>

                              <button className={styles.deleteBtn} onClick={() => setPortToDelete({
                                id: port.id,
                                name: port.name,
                                location: `${port.provinceName}, ${port.countryName}`,
                                imageUrl: port.mainImageUrl ?? undefined,
                              })}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}

                          {portToDelete && portToDelete.id === port.id && (
                            <DeletePortModal
                              portId={portToDelete.id}
                              portName={portToDelete.name}
                              portLocation={portToDelete.location}
                              mainImageUrl={portToDelete.imageUrl}
                              onCancel={() => setPortToDelete(null)}
                              onSuccess={() => {
                                setPortToDelete(null);
                                applyFilters(); // Refresca los filtros avanzados por POST
                              }}
                            />
                          )}

                          {portToReactivate && portToReactivate.id === port.id && (
                            <ReactivatePortModal
                              portId={portToReactivate.id}
                              portName={portToReactivate.name}
                              portLocation={portToReactivate.location}
                              mainImageUrl={portToReactivate.imageUrl}
                              onCancel={() => setPortToReactivate(null)}
                              onSuccess={() => {
                                setPortToReactivate(null);
                                applyFilters(); // Refresca los filtros avanzados por POST
                              }}
                            />
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* LOAD MORE */}
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

          {/* SIDEBAR RIGHT */}
          {isSidebarOpen && (
            <PortFilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={() => applyFilters()}
              onClear={resetFilters}
              countries={countries}
              provinces={provinces}
              cities={cities}
            />
          )}

        </div>

        {/* FOOTER */}
        <footer className="text-center mt-12 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>

      </div>

      {isModalOpen && selectedPortId && (
        <PortDetailModal
          portId={selectedPortId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </MainLayout>
  );
};

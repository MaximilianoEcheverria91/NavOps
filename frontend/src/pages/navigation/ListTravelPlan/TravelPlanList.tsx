import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, SlidersHorizontal, CheckCircle, Sailboat, Anchor, MapPin, Navigation, Calendar, X, ArrowLeft } from 'lucide-react';
import { useTravelPlans } from '../../../hooks/useTravelPlans';
import type { TravelPlanFilters } from '../../../hooks/useTravelPlans';
import { NavigationLayout } from '../../../layouts/NavigationLayout';
import { useTheme } from '../../../hooks/useTheme';
import { FilterDropdown } from './FilterDropdown/FilterDropdown';
import styles from './TravelPlanList.module.css';
import type { TravelPlanStatus } from '../../../types/travelPlan';
import { ConfirmModal } from '../../../components/ui/ConfirmModal/ConfirmModal';
// 🚀 CORREGIDO: Importamos la llamada de Axios nativa de tu servicio de travesías
import { cancelVoyagePlan } from '../../../services/api/voyageService'; 
import { TravelPlanDetailModal } from '../TravelPlanDetailModal/TravelPlanDetailModal';

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const formatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const parts = formatter.formatToParts(date);
  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;
  if (!day || !month || !year) return isoString;
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

const getStatusStyles = (status: TravelPlanStatus) => {
  switch(status) {
    case 'PLANNED': return { label: 'Programando', className: styles.badgePlanned };
    case 'EN_ROUTE': 
    case 'IN_PROGRESS': return { label: 'En Curso', className: styles.badgeEnRoute };
    case 'DELAYED': return { label: 'Demorado', className: styles.badgeDelayed };
    default: return { label: status, className: styles.badgeDefault };
  }
};

const mapStatusLabel = (val: string) => {
  const map: any = { PLANNED: 'Planificado', EN_ROUTE: 'En curso', COMPLETED: 'Completado', DELAYED: 'Demorado', CANCELLED: 'Cancelado' };
  return map[val] || val;
};

const mapCategoryLabel = (val: string) => {
  const map: any = { ARMAMENT: 'Armamento', FOOD_AND_BEVERAGES: 'Alimentos', VEHICLES: 'Vehículos', MACHINERY: 'Maquinarias', OTHER: 'Otros' };
  return map[val] || val;
};

export const TravelPlanList: React.FC = () => {
  useTheme(); 
  const navigate = useNavigate(); 
  // Extraemos fetchFilteredPlans, filters y page para re-gatiIlar la consulta tras cancelar
  const { metrics, activePlans, pagination, loading, error, fetchFilteredPlans } = useTravelPlans();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TravelPlanFilters>({});
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [planIdToCancel, setPlanIdToCancel] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchFilteredPlans(filters, page, pageSize);
  }, [filters, page, fetchFilteredPlans]);

  const handleApplyFilters = (newFilters: TravelPlanFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPage(0);
  };

  const handleCancelClick = (id: string) => {
    setPlanIdToCancel(id);      
    setIsCancelModalOpen(true); 
  };

  const removeFilterChip = (type: string, value?: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'status' && value) {
        newFilters.statuses = prev.statuses?.filter(s => s !== value);
        if (newFilters.statuses?.length === 0) delete newFilters.statuses;
      }
      else if (type === 'departureFrom') delete newFilters.departureFrom;
      else if (type === 'departureTo') delete newFilters.departureTo;
      else if (type === 'arrivalFrom') delete newFilters.arrivalFrom;
      else if (type === 'arrivalTo') delete newFilters.arrivalTo;
      else if (type === 'category' && value) {
        newFilters.productCategories = prev.productCategories?.filter(c => c !== value);
        if (newFilters.productCategories?.length === 0) delete newFilters.productCategories;
      }
      else if (type === 'cargoType' && value) {
        newFilters.cargoTypes = prev.cargoTypes?.filter(c => c !== value);
        if (newFilters.cargoTypes?.length === 0) delete newFilters.cargoTypes;
      }
      else if (type === 'hazardousMaterial') delete newFilters.hazardousMaterial;
      return newFilters;
    });
    setPage(0);
  };

  const hasActiveFilters = useMemo(() => {
    return (filters.statuses && filters.statuses.length > 0) ||
      filters.departureFrom || filters.departureTo ||
      filters.arrivalFrom || filters.arrivalTo ||
      (filters.productCategories && filters.productCategories.length > 0) ||
      (filters.cargoTypes && filters.cargoTypes.length > 0) ||
      filters.hazardousMaterial !== undefined;
  }, [filters]);

  const finalDisplayPlans = useMemo(() => {
    if (!searchTerm) return activePlans;
    const lower = searchTerm.toLowerCase();
    return activePlans.filter(plan => 
      (plan.shipName && plan.shipName.toLowerCase().includes(lower)) ||
      (plan.originPortName && plan.originPortName.toLowerCase().includes(lower)) ||
      (plan.destinationPortName && plan.destinationPortName.toLowerCase().includes(lower)) ||
      (plan.id && plan.id.toLowerCase().includes(lower))
    );
  }, [activePlans, searchTerm]);

  // 🚀 ACCIÓN DEFINITIVA: Sincronizada con las directivas de useTravelPlans
  const handleConfirmCancel = async () => {
    if (!planIdToCancel) return;
    
    try {
      setIsCanceling(true);
      
      // Ejecutamos la petición PATCH de forma segura a Spring Boot
      await cancelVoyagePlan(planIdToCancel);
      
      // 🚀 SOLUCIÓN SENIOR: En lugar de usar un setPlans inexistente, volvemos a llamar 
      // a fetchFilteredPlans con los filtros actuales. Esto re-ejecuta la consulta JPA,
      // actualiza los almacenes del hook y refresca la grilla entera de forma nativa.
      await fetchFilteredPlans(filters, page, pageSize);
      
      setIsCancelModalOpen(false);
      setPlanIdToCancel(null);
    } catch (error) {
      console.error("Error al cancelar la travesía:", error);
      alert("No se pudo cancelar la travesía. Verifique las reglas de negocio en el servidor.");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <NavigationLayout>
      <div className={styles.pageContainer}>
        
        {/* Cabecera */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Lista de Viajes</h1>
            <p className={styles.pageSubtitle}>Bienvenido al sistema de gestión y Navegación</p>
          </div>
          <button 
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/navigation/menu')}
          >
            <ArrowLeft size={16} /> Volver al Menú
          </button>
        </div>

        {/* KPIs */}
        <div className={styles.kpiContainer}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ color: '#3b82f6', borderColor: '#3b82f6' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Programados</span>
              <span className={styles.kpiValue}>{metrics.scheduledCount}</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ color: '#10b981', borderColor: '#10b981' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Total Viajes</span>
              <span className={styles.kpiValue}>{metrics.totalCompletedCount}</span>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className={styles.controlsBar}>
          <div className={styles.searchFloating}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Busca por ID, barco o puerto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterBtnContainer}>
            <button className={styles.filterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <SlidersHorizontal size={20} />
            </button>
            <FilterDropdown 
              isOpen={isFilterOpen} 
              onClose={() => setIsFilterOpen(false)} 
              currentFilters={filters}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Chips */}
        {hasActiveFilters && (
          <div className={styles.activeFiltersBar}>
            {filters.statuses?.map(s => (
              <div key={`s-${s}`} className={styles.chip}>
                Estado: {mapStatusLabel(s)} <button onClick={() => removeFilterChip('status', s)}><X size={14} /></button>
              </div>
            ))}
            {filters.departureFrom && <div className={styles.chip}>Desde: {filters.departureFrom} <button onClick={() => removeFilterChip('departureFrom')}><X size={14} /></button></div>}
            {filters.departureTo && <div className={styles.chip}>Hasta: {filters.departureTo} <button onClick={() => removeFilterChip('departureTo')}><X size={14} /></button></div>}
            {filters.productCategories?.map(c => (
              <div key={`c-${c}`} className={styles.chip}>
                Categoría: {mapCategoryLabel(c)} <button onClick={() => removeFilterChip('category', c)}><X size={14} /></button>
              </div>
            ))}
            {filters.hazardousMaterial !== undefined && (
              <div className={styles.chip}>
                IMO: {filters.hazardousMaterial ? 'SÍ' : 'NO'} <button onClick={() => removeFilterChip('hazardousMaterial')}><X size={14} /></button>
              </div>
            )}
            <button className={styles.clearAllBtn} onClick={handleClearFilters}>Limpiar Todos</button>
          </div>
        )}

        {/* Grilla */}
        {loading ? (
          <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>
        ) : error ? (
          <div className={styles.emptyState}>{error}</div>
        ) : finalDisplayPlans.length === 0 ? ( 
          <div className={styles.emptyState}>No se encontraron travesías activas.</div>
        ) : (
          <>
            <div className={styles.grid}>
              {finalDisplayPlans.map(plan => { 
                const statusStyle = getStatusStyles(plan.status);
                return (
                  <div key={plan.id} className={styles.card}>
                    <div className={styles.cardImageContainer}>
                      {plan.shipMainImageUrl ? (
                        <img src={plan.shipMainImageUrl} alt={plan.shipName} className={styles.cardImage} />
                      ) : (
                        <Sailboat size={48} className={styles.fallbackIcon} />
                      )}
                      <div className={`${styles.statusBadge} ${statusStyle.className}`}>{statusStyle.label}</div>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.shipNameRow}><Anchor size={20} color="#e2e8f0" /> {plan.shipName}</div>
                      <div className={styles.routeSection}>
                        <div className={styles.portRow}>
                          <MapPin size={18} className={styles.iconOrigin} />
                          <div className={styles.portInfo}><span className={styles.portLabel}>Origen</span><span className={styles.portName}>{plan.originPortName}</span></div>
                        </div>
                        <div className={styles.distanceRow}>
                          <Navigation size={16} /><span>{plan.distanceMiles?.toLocaleString()} MN</span>
                          {plan.stopCount > 0 && <span className={styles.stopCount}>{plan.stopCount} Escalas</span>}
                        </div>
                        <div className={styles.portRow}>
                          <MapPin size={18} className={styles.iconDestination} />
                          <div className={styles.portInfo}><span className={styles.portLabel}>Destino</span><span className={styles.portName}>{plan.destinationPortName}</span></div>
                        </div>
                      </div>
                      <div className={styles.datesRow}>
                        <Calendar size={16} />
                        <div className={styles.dateRange}>
                          <span>{formatDate(plan.departureTime)}</span><span className={styles.dateArrow}>⟶</span><span>{formatDate(plan.eta)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button className={styles.btnDetail} onClick={() => setSelectedPlanId(plan.id)}>Ver detalle</button>
                      {(plan.status === 'PLANNED' || plan.status === 'DELAYED') && (
                        <>
                          <button 
                            className={styles.btnEdit} 
                            onClick={() => navigate('/navigation/create-plan', { state: { editPlanId: plan.id } })} 
                          >
                            Editar
                          </button>
                          <button 
                            className={styles.btnCancel}
                            disabled={isCanceling} // 🚀 CORREGIDO: Evita doble clic, TypeScript ya no chilla
                            onClick={() => handleCancelClick(plan.id)}
                          >
                            Cancelar 
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button className={styles.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</button>
                <span className={styles.pageInfo}>Página {pagination.currentPage + 1} de {pagination.totalPages}</span>
                <button className={styles.pageBtn} disabled={page >= pagination.totalPages - 1} onClick={() => setPage(p => p + 1)}>Siguiente</button>
              </div>
            )}
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="¿Confirmar cancelación de travesía?"
        description="Esta acción cambiará el estado operacional del plan a CANCELADO. El buque y la tripulación asignados serán liberados para nuevos itinerarios."
        onConfirm={handleConfirmCancel} 
        onCancel={() => {
          setIsCancelModalOpen(false);   
          setPlanIdToCancel(null);       
        }}
      />
      {selectedPlanId && (
        <TravelPlanDetailModal
          planId={selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
        />
      )}
    </NavigationLayout>
  );
};
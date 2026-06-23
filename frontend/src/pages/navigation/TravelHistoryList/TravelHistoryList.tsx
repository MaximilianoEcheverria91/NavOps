import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, SlidersHorizontal, CheckCircle, Sailboat, Anchor, MapPin, Navigation, Calendar, X, ArrowLeft, History } from 'lucide-react';
import { MainLayout } from '../../../layouts/MainLayout';
import { useTheme } from '../../../hooks/useTheme';
import { apiClient } from '../../../api/apiClient'; // 🔥 Consumo directo de Axios
import styles from './TravelHistoryList.module.css';
import { TravelPlanDetailModal } from '../TravelPlanDetailModal/TravelPlanDetailModal';
// ✅ Por la llamada limpia a tu servicio centralizado:
import { getHistoryVoyages } from '../../../services/api/voyageService';
// Formateador de fechas idéntico a tu diseño
const formatDate = (isoString: string) => {
  if (!isoString) return '-';
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

// Mapeador de estados exclusivo para el historial
const getHistoryStatusStyles = (status: string) => {
  switch(status) {
    case 'COMPLETED': return { label: 'Finalizado', className: styles.badgeCompleted || styles.badgeEnRoute };
    case 'CANCELLED': return { label: 'Cancelado', className: styles.badgeCancelled || styles.badgeDefault };
    default: return { label: status, className: styles.badgeDefault };
  }
};

export const TravelHistoryList: React.FC = () => {
  useTheme(); 
  const navigate = useNavigate(); 
  
  const [historyPlans, setHistoryPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // KPIs dinámicos calculados en caliente sobre la respuesta real del Back
  const metrics = useMemo(() => {
    const completed = historyPlans.filter(p => p.status === 'COMPLETED').length;
    const cancelled = historyPlans.filter(p => p.status === 'CANCELLED').length;
    return { completedCount: completed, cancelledCount: cancelled, total: historyPlans.length };
  }, [historyPlans]);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚀 Llamamos a la función limpia del servicio que acabamos de agregar
      const data = await getHistoryVoyages();
      setHistoryPlans(data);
      
    } catch (err: any) {
      console.error("Error al obtener el historial de travesías:", err);
      setError("No se pudo cargar el historial de navegación. Intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Buscador reactivo en memoria
  const finalDisplayPlans = useMemo(() => {
    if (!searchTerm) return historyPlans;
    const lower = searchTerm.toLowerCase();
    return historyPlans.filter(plan => 
      (plan.shipName && plan.shipName.toLowerCase().includes(lower)) ||
      (plan.originPortName && plan.originPortName.toLowerCase().includes(lower)) ||
      (plan.destinationPortName && plan.destinationPortName.toLowerCase().includes(lower)) ||
      (plan.id && plan.id.toLowerCase().includes(lower))
    );
  }, [historyPlans, searchTerm]);

  return (
    <MainLayout>
      <div className={styles.pageContainer}>
        
        {/* Cabecera */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History size={32} className="text-sky-400" /> Historial de Travesías
            </h1>
            <p className={styles.pageSubtitle}>Registro histórico de navegaciones completadas y canceladas</p>
          </div>
          <button 
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/navigation/menu')}
          >
            <ArrowLeft size={16} /> Volver al Menú
          </button>
        </div>

        {/* KPIs Relacionados */}
        <div className={styles.kpiContainer}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ color: '#10b981', borderColor: '#10b981' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Finalizados</span>
              <span className={styles.kpiValue}>{metrics.completedCount}</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
              <X size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Cancelados</span>
              <span className={styles.kpiValue}>{metrics.cancelledCount}</span>
            </div>
          </div>
        </div>

        {/* Barra de Controles (Buscador alineado) */}
        <div className={styles.controlsBar}>
          <div className={styles.searchFloating}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Busca por ID, barco o puerto en el historial..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grilla de Tarjetas */}
        {loading ? (
          <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>
        ) : error ? (
          <div className={styles.emptyState} style={{ color: '#ef4444' }}>{error}</div>
        ) : finalDisplayPlans.length === 0 ? ( 
          <div className={styles.emptyState}>No se encontraron registros en el historial de travesías.</div>
        ) : (
          <div className={styles.grid}>
            {finalDisplayPlans.map(plan => { 
              const statusStyle = getHistoryStatusStyles(plan.status);
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
                    <div className={styles.shipNameRow}>
                      <Anchor size={20} color="#e2e8f0" /> {plan.shipName}
                    </div>
                    
                    <div className={styles.routeSection}>
                      <div className={styles.portRow}>
                        <MapPin size={18} className={styles.iconOrigin} />
                        <div className={styles.portInfo}>
                          <span className={styles.portLabel}>Origen</span>
                          <span className={styles.portName}>{plan.originPortName}</span>
                        </div>
                      </div>
                      
                      <div className={styles.distanceRow}>
                        <Navigation size={16} />
                        <span>{plan.distanceMiles?.toLocaleString()} MN</span>
                        {plan.stopCount > 0 && <span className={styles.stopCount}>{plan.stopCount} Escalas</span>}
                      </div>
                      
                      <div className={styles.portRow}>
                        <MapPin size={18} className={styles.iconDestination} />
                        <div className={styles.portInfo}>
                          <span className={styles.portLabel}>Destino</span>
                          <span className={styles.portName}>{plan.destinationPortName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.datesRow}>
                      <Calendar size={16} />
                      <div className={styles.dateRange}>
                        <span>{formatDate(plan.departureTime)}</span>
                        <span className={styles.dateArrow}>⟶</span>
                        <span>{formatDate(plan.eta)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🔒 ACCIÓN LIMPIA: Únicamente botón de Ver detalle a ancho completo */}
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.btnDetail} 
                      style={{ width: '100%', flex: 'none' }} 
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalle Reutilizado perfectamente */}
      {selectedPlanId && (
        <TravelPlanDetailModal
          planId={selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
        />
      )}
    </MainLayout>
  );
};
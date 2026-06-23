import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import styles from './MyTravelPlanList.module.css';
import { getMyAssignedVoyages, startTravelPlan, cancelVoyagePlan } from '../../../services/api/voyageService';
import type { VoyageSummary } from '../../../types/navigation';
import { AlertModal } from '../../../components/ui/AlertModal/AlertModal';
import { MainLayout } from '../../../layouts/MainLayout';
import { TravelPlanDetailModal } from '../TravelPlanDetailModal/TravelPlanDetailModal';
// 🔥 IMPORTAMOS TU COMPONENTE DE CONFIRMACIÓN
import { ConfirmModal } from '../../../components/ui/ConfirmModal/ConfirmModal';

export const MyTravelPlanList: React.FC = () => {
  const navigate = useNavigate();
  const [voyages, setVoyages] = useState<VoyageSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // States for Alert Modal (Errores informativos)
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  // 🚀 Estados para el ConfirmModal de Cancelación (Doble acción)
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  // Estados para el Modal de Detalle
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedVoyageId, setSelectedVoyageId] = useState<string | null>(null);

  useEffect(() => {
    fetchVoyages();
  }, []);

  const fetchVoyages = async () => {
    try {
      setLoading(true);
      const data = await getMyAssignedVoyages();
      setVoyages(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching my voyages:', err);
      setError('No se pudieron cargar los viajes asignados.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (id: string) => {
    setSelectedVoyageId(id);
    setIsDetailOpen(true);
  };

  const handleStartVoyage = async (id: string) => {
    try {
      await startTravelPlan(id);
      navigate('/navigation/dashboard', { state: { travelPlanId: id } });
    } catch (error: any) {
      console.error("Error capturado en el Frente:", error);
      const mensajeDelBackend = error.response?.data?.message 
        || "Error al iniciar el viaje. Por favor, intente nuevamente.";
      setAlertMessage(mensajeDelBackend); 
      setIsAlertOpen(true); 
    }
  };

  // 🔥 AL HACER CLIC EN CANCELAR: Ahora abrimos el ConfirmModal estético
  const handleCancelClick = (id: string) => {
    setPendingCancelId(id);
    setShowCancelConfirm(true);
  };

  // 🚀 ESTA FUNCIÓN SE EJECUTA SÓLO SI TOCAN "SÍ" EN EL CONFIRM_MODAL
  const executeCancellation = async () => {
    if (!pendingCancelId) return;
    
    try {
      setLoading(true);
      setShowCancelConfirm(false); // Cerramos el confirm modal
      
      await cancelVoyagePlan(pendingCancelId); 
      await fetchVoyages(); // 🔄 Recargamos la lista en vivo
      
      setPendingCancelId(null);
    } catch (err: any) {
      console.error('Error cancelling voyage:', err);
      // Si el backend rechaza la acción, usamos el AlertModal para avisar la falla
      const backendError = err.response?.data?.message || 'Error al intentar cancelar el viaje.';
      setAlertMessage(backendError);
      setPendingCancelId(null);
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredVoyages = useMemo(() => {
    if (!searchTerm) return voyages;
    const lowerSearch = searchTerm.toLowerCase();
    return voyages.filter(v => 
      v.shipName.toLowerCase().includes(lowerSearch) ||
      v.originPortName.toLowerCase().includes(lowerSearch) ||
      v.destinationPortName.toLowerCase().includes(lowerSearch)
    );
  }, [voyages, searchTerm]);

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Lista de Viajes</h1>
          <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
        </header>

        <div className={styles.controlsContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Buscar por barco, origen o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.filterButton}>
            <SlidersHorizontal size={20} />
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Barco</th>
                <th className={styles.th}>Origen</th>
                <th className={styles.th}>Destino</th>
                <th className={styles.th}>F. de Salida</th>
                <th className={styles.th}>F. de Llegada</th>
                <th className={styles.th}>Estado</th>
                <th className={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.loading}>Cargando viajes...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className={styles.error}>{error}</td>
                </tr>
              ) : filteredVoyages.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>No se encontraron viajes.</td>
                </tr>
              ) : (
                filteredVoyages.map(voyage => (
                  <tr key={voyage.id} className={styles.row}>
                    <td className={styles.td}>{voyage.shipName}</td>
                    <td className={styles.td}>{voyage.originPortName}</td>
                    <td className={styles.td}>{voyage.destinationPortName}</td>
                    <td className={`${styles.td} ${styles.dateCell}`}>{formatDate(voyage.departureTime)}</td>
                    <td className={`${styles.td} ${styles.dateCell}`}>{formatDate(voyage.eta)}</td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${
                        voyage.status === 'PLANNED' ? styles.badgePlanned : 
                        (voyage.status === 'IN_PROGRESS' || voyage.status === 'EN_ROUTE') ? styles.badgeInProgress : ''
                      }`}>
                        {voyage.status === 'PLANNED' ? 'Programado' : 
                         (voyage.status === 'IN_PROGRESS' || voyage.status === 'EN_ROUTE') ? 'En curso' : voyage.status}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <button 
                          className={`${styles.actionBtn} ${styles.btnDetails}`}
                          onClick={() => handleOpenDetail(voyage.id)}
                        >
                          Ver detalle
                        </button>
                        {voyage.status === 'PLANNED' && (
                          <>
                            <button 
                              className={`${styles.actionBtn} ${styles.btnStart}`}
                              onClick={() => handleStartVoyage(voyage.id)}
                            >
                              Iniciar
                            </button>
                            <button 
                              className={`${styles.actionBtn} ${styles.btnCancel}`}
                              onClick={() => handleCancelClick(voyage.id)}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {(voyage.status === 'IN_PROGRESS' || voyage.status === 'EN_ROUTE') && (
                          <button 
                            className={`${styles.actionBtn} ${styles.btnDashboard}`}
                            onClick={() => navigate('/navigation/dashboard', { state: { activePlanId: voyage.id } })}
                          >
                            Ver Dashboard
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Alert Modal solo para Errores o Mensajes del Sistema (Botón único de Aceptar) */}
      <AlertModal 
       isOpen={isAlertOpen} 
       title="Control de Operaciones"
       highlightText={alertMessage} 
       onClose={() => setIsAlertOpen(false)}
      />

      {/* 🔥 NUEVO CONFIRM MODAL CON BOTÓN SÍ Y CANCELAR */}
      {showCancelConfirm && (
        <ConfirmModal
          isOpen={showCancelConfirm}
          title="Confirmar Cancelación"
          description="¿Está seguro de que desea cancelar este plan de travesía? Esta acción no se puede deshacer."
          onConfirm={executeCancellation} // Si dice que sí, liquida el viaje
          onCancel={() => {
            setShowCancelConfirm(false); // Si dice que no, cierra limpio
            setPendingCancelId(null);
          }}
        />
      )}

      {/* Renderizado del Modal de Detalle */}
      {isDetailOpen && selectedVoyageId && (
        <TravelPlanDetailModal
          planId={selectedVoyageId}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedVoyageId(null);
          }}
        />
      )}
    </MainLayout>
  );
};
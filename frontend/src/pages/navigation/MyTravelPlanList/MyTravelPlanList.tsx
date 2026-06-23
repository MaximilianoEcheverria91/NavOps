import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import styles from './MyTravelPlanList.module.css';
import { getMyAssignedVoyages, startTravelPlan, cancelVoyagePlan } from '../../../services/api/voyageService';
import type { VoyageSummary } from '../../../types/navigation';
import { AlertModal } from '../../../components/ui/AlertModal/AlertModal';
import { MainLayout } from '../../../layouts/MainLayout';

export const MyTravelPlanList: React.FC = () => {
  const navigate = useNavigate();
  const [voyages, setVoyages] = useState<VoyageSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // States for Alert Modal
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  
  // 🚀 NUEVO: Para recordar qué viaje quiere cancelar el capitán
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

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

  const handleStartVoyage = async (id: string) => {
  try {
    await startTravelPlan(id);
    // Si sale todo bien, nos eyectamos al dashboard
    navigate('/navigation/dashboard', { state: { travelPlanId: id } });
  } catch (error: any) {
    console.error("Error capturado en el Frente:", error);
    
    // 🚀 LA MAGIA: Buscamos el campo 'message' que envía el GlobalExceptionHandler
    const mensajeDelBackend = error.response?.data?.message 
      || "Error al iniciar el viaje. Por favor, intente nuevamente.";
    
    // Asignamos el mensaje real al estado del modal
    setAlertMessage(mensajeDelBackend); 
    setIsAlertOpen(true); // Abrimos tu modal
  }
};

  const handleCancelClick = (id: string) => {
    setPendingCancelId(id);
    setAlertMessage('¿Está seguro de que desea cancelar este plan de travesía? Esta acción no se puede deshacer.');
    setIsAlertOpen(true);
  };

  // 🚀 LA MAGIA: Esta función se ejecuta cuando confirman adentro del modal
  const executeCancellation = async () => {
    if (!pendingCancelId) return;
    
    try {
      setLoading(true);
      setIsAlertOpen(false); // Cerramos el modal primero
      
      await cancelVoyagePlan(pendingCancelId); // Le pega al PATCH /cancel del service
      await fetchVoyages(); // 🔄 Recargamos la lista en vivo desde el Back
      
      setPendingCancelId(null);
    } catch (err: any) {
      console.error('Error cancelling voyage:', err);
      // Si el back rechaza la cancelación, reusamos el modal para mostrar la falla
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
                        <button className={`${styles.actionBtn} ${styles.btnDetails}`}>Ver detalle</button>
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
      
      {/* Alert Modal for Errors */}
      <AlertModal 
       isOpen={isAlertOpen} 
       title={"Control de Operaciones"} // 👈 Inyectamos tu mensaje acá temporalmente
       highlightText={alertMessage} 
       onClose={() => setIsAlertOpen(false)}
      />

      <AlertModal 
       isOpen={isAlertOpen} 
       title={pendingCancelId ? "Confirmar Cancelación" : "Control de Operaciones"} 
       highlightText={alertMessage} 
       buttonText={pendingCancelId ? "Confirmar" : "Aceptar"} // 👈 Botón dinámico
       onClose={pendingCancelId ? executeCancellation : () => setIsAlertOpen(false)} // 👈 Acción dinámica
      />
    </MainLayout>
  );
};

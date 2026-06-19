import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateVoyagePlan } from '../../../hooks/useCreateVoyagePlan';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { ConfirmModal } from '../../../components/ui/ConfirmModal/ConfirmModal'; 
import { NavigationLayout } from '../../../layouts/NavigationLayout';
import { Sailboat, Map, Users, Package, Check, X, ArrowLeft} from 'lucide-react';
import styles from './CreateVoyagePlan.module.css';
import { SelectShip } from './SelectShip/SelectShip';
import { SelectCrew } from './SelectCrew/SelectCrew';
import { ManageCargo } from './SelectCargo/ManageCargo/ManageCargo';
import { SelectRoute } from './SelectRoute/SelectRoute';
import imagenCarga from '../../../assets/carga.jpg';
import type { ShipActiveSelect } from '../../../types/ship';

type VoyagePlanState = {
  shipId: string | null;
  shipData: ShipActiveSelect | null;
  destinationId: string | null;
  crewIds: string[];
  cargoDetails: any | null;
  currentStep: number;
  routeData?: any;
};

const SHIP_TYPE_TRANSLATIONS: Record<string, string> = {
  CONTAINER_SHIP: 'Portacontenedor',
  BULK_CARRIER: 'Granelero',
  TANKER: 'Petrolero',
  RO_RO: 'Ro-Ro',
  FISHING_VESSEL: 'Pesquero',
  CRUISE_SHIP: 'Crucero',
  FERRY: 'Ferry',
  PASSENGER_SHIP: 'Buque de Pasajero',
  SUPPLY_SHIP: 'Buque de suministro',
  TUGBOAT: 'Remolque',
  AIRCRAFT_CARRIER: 'Portaaviones',
  SUBMARINE: 'Submarino',
  PATROL_BOAT: 'Patrullero',
  LANDING_SHIP: 'Barco de desembarque',
  YACHT: 'Yate',
  SAILBOAT: 'Velero',
  SPEEDBOAT: 'Lancha',
  RESEARCH_VESSEL: 'Buque de investigación',
  TRAINING_SHIP: 'Barco de formación',
  HOSPITAL_SHIP: 'Buque hospital',
  PILOT_BOAT: 'Barco piloto',
  BARGE: 'Barcaza',
  ICEBREAKER: 'Rompehielos',
  NOTICE_SHIP: 'Buque de aviso',
  OCEAN_PATROL_OPV: 'Patrulla Oceanica OPV',
  CAR_CARRIER: 'Portavehículos',
  REEFER: 'Frigorífico',
  GENERAL_CARGO: 'Cranelero',
  DESTROYER: 'Destructor',
  FRIGATE: 'Fragata',
  CORVETTE: 'Corbeta',
};

export const CreateVoyagePlan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.editPlanId;
  const isEditMode = !!id;

  const [planState, setPlanState] = useState<VoyagePlanState>({
    shipId: null,
    shipData: null,
    destinationId: null,
    crewIds: [],
    cargoDetails: null,
    currentStep: 1, 
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLeaveAlertOpen, setIsLeaveAlertOpen] = useState(false);
  const { saveVoyagePlan, updateVoyagePlan, fetchVoyagePlan, loading } = useCreateVoyagePlan();

  useEffect(() => {
    if (isEditMode && id) {
      const loadPlan = async () => {
        try {
          const data = await fetchVoyagePlan(id);
          
          const departureDateObj = new Date(data.departureTime);
          const arrivalDateObj = new Date(data.eta);
          
          const resolvedShipId = data.shipId || data.idShip;
          const resolvedShipImageUrl = data.shipMainImageUrl || data.mainImageUrl || data.shipImageUrl || null;

          setPlanState({
            shipId: resolvedShipId, 
            shipData: {
              id: resolvedShipId,
              name: data.shipName || data.ship?.name || 'Buque Seleccionado',
              // 🚀 SOLUCIÓN: Buscamos en la raíz, en el objeto anidado o dejamos un fallback de 5000 para que no dé NaN
              cargoCapacityTonnes: data.shipCargoCapacityTonnes || data.cargoCapacityTonnes || data.ship?.cargoCapacityTonnes || 5000, 
              crewCapacity: data.shipCrewCapacity || data.crewCapacity || data.ship?.crewCapacity || 30,
              mainImageUrl: resolvedShipImageUrl, 
              registration: data.shipRegistration || data.ship?.registration || 'REG-OFICIAL', 
              shipType: data.shipType || data.ship?.shipType || 'CONTAINER_SHIP'
            } as any,
            destinationId: data.destinationPortId,
            crewIds: data.crewIds || data.crewMemberIds || [],
            cargoDetails: data.cargoItems || data.cargoDetails || [],
            currentStep: 4, 
            routeData: {
              // 🚀 Buscamos las latitudes tanto en la raíz como dentro del objeto port si Hibernate cambió el DTO
              origin: { 
                id: data.originPortId, 
                name: data.originPortName || 'Puerto de Origen',
                latitude: data.originLatitude || data.originPortLatitude || data.originPort?.latitude || -54.8019,
                longitude: data.originLongitude || data.originPortLongitude || data.originPort?.longitude || -68.3029
              },
              destination: { 
                id: data.destinationPortId, 
                name: data.destinationPortName || 'Puerto de Destino',
                latitude: data.destinationLatitude || data.destinationPortLatitude || data.destinationPort?.latitude || -61.1167,
                longitude: data.destinationLongitude || data.destinationPortLongitude || data.destinationPort?.longitude || -55.9667
              },
              departureDate: departureDateObj.toISOString().split('T')[0],
              departureTime: departureDateObj.toTimeString().substring(0, 5),
              arrivalDate: arrivalDateObj.toISOString().split('T')[0],
              arrivalTime: arrivalDateObj.toTimeString().substring(0, 5),
              totalDistance: data.distanceMiles || data.distance || 0,
              etaHours: data.estimatedHours || 0,
              totalDays: Math.ceil((data.estimatedHours || 24) / 24),
              stops: data.stops ? data.stops.map((s: any) => ({ 
                ...s, 
                id: s.portId || s.id,
                latitude: s.latitude || s.port?.latitude || 0,
                longitude: s.longitude || s.port?.longitude || 0
              })) : []
            }
          });
        } catch (error) {
          console.error("Error al precargar el plan", error);
        }
      };
      loadPlan();
    }
  }, [id, isEditMode]);

  const completedSteps = [
    planState.shipId !== null,
    planState.destinationId !== null,
    planState.crewIds.length > 0,
    planState.cargoDetails !== null,
  ].filter(Boolean).length;

  const progressPercentage = (completedSteps / 4) * 100;
  const isComplete = completedSteps === 4;

  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (completedSteps > 0 || isEditMode) { 
        window.history.pushState(null, '', window.location.pathname);
        setIsLeaveAlertOpen(true); 
      } else {
        navigate('/navigation/travel-plans'); 
      }
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [completedSteps, navigate, isEditMode]); 

  const handleCancelClick = () => {
    if (completedSteps > 0) {
      setIsLeaveAlertOpen(true);
    } else {
      navigate('/navigation/travel-plans');
    }
  };

  const handleSelectShip = (id: string, shipData: ShipActiveSelect) => {
    setPlanState(prev => ({ 
      ...prev, 
      shipId: id, 
      shipData: shipData,
      currentStep: prev.currentStep === 2 ? 3 : prev.currentStep
    }));
    setActiveModal(null);
  };

  const handleSelectDestination = (id: string) => {
    setPlanState(prev => ({ ...prev, destinationId: id }));
    setActiveModal(null);
  };

  const handleSetRoute = (routeData: any) => {
    setPlanState(prev => ({ 
      ...prev, 
      destinationId: routeData.destination.id,
      routeData: routeData,
      currentStep: prev.currentStep === 1 ? 2 : prev.currentStep
    }));
    setActiveModal(null);
  };

  const handleSelectCrew = (crewIds: string[]) => {
    setPlanState(prev => ({ ...prev, crewIds,
      currentStep: prev.currentStep === 3 ? 4 : prev.currentStep
     }));
    setActiveModal(null);
  };

  const handleSetCargo = (cargoList: any[]) => {
    setPlanState(prev => ({ ...prev, cargoDetails: cargoList.length > 0 ? cargoList : null }));
    setActiveModal(null);
  };

  const handlePreview = async () => {
    if (isComplete && !loading) {
      try {
        if (isEditMode && id) {
          await updateVoyagePlan(id, planState);
        } else {
          await saveVoyagePlan(planState);
        }
        setShowSuccessModal(true);
      } catch (error) {
        // El hook maneja el error de forma interna
      }
    }
  };

  return (
    <NavigationLayout>
      {activeModal === 'destination' ? (
        <SelectRoute
          onSaveSelection={handleSetRoute}
          onCancel={() => setActiveModal(null)}
          initialRouteData={planState.routeData}
        />
      ) : activeModal === 'ship' ? (
        <SelectShip 
          onSelectShip={handleSelectShip} 
          onCancel={() => setActiveModal(null)}
          selectedShipId={planState.shipId}
        />
      ) : activeModal === 'crew' ? (
        <SelectCrew
          onSelectCrew={handleSelectCrew}
          onCancel={() => setActiveModal(null)}
          initialSelectedIds={planState.crewIds}
          crewCapacity={planState.shipData?.crewCapacity}
        />
      ) : activeModal === 'cargo' ? (
        <ManageCargo
          planId={id}
          shipCapacityTonnes={planState.shipData?.cargoCapacityTonnes}
          initialCargoList={planState.cargoDetails || []}
          onSaveSelection={handleSetCargo}
          onCancel={() => setActiveModal(null)}
        />
      ) : (
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>{isEditMode ? `Modificar Plan de Travesía` : `Nuevo plan de Travesía`}</h1>
            <button className={styles.cancelButton}
              type="button"
              onClick={handleCancelClick}
            >
              <ArrowLeft size={16} /> Volver a Grilla
            </button>
          </header>
          <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <div className={styles.progressIcon}>
              <Check size={16} />
            </div>
            <div className={styles.progressTexts}>
              <h4>Progreso del Plan</h4>
              <p>{completedSteps} de 4 secciones completadas</p>
            </div>
          </div>
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Paso 1: Ruta */}
          {planState.routeData ? (
            <div className={styles.shipSelectedCard} onClick={() => setActiveModal('destination')}>
              <div className={styles.imageContainer}>
                <div className={styles.noImagePlaceholder} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                  <Map size={48} color="#0284c7" />
                </div>
                {planState.routeData.stops && planState.routeData.stops.length > 0 ? (
                  <span className={styles.statusBadge} style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#f59e0b', color: '#f59e0b' }}>
                    ⚠️ {planState.routeData.stops.length} {planState.routeData.stops.length === 1 ? 'Parada' : 'Paradas'}
                  </span>
                ) : (
                  <span className={styles.statusBadgeSuccess} style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    Ruta Directa
                  </span>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.shipNameRow} style={{ color: '#22d3ee', gap: '6px' }}>
                  <Map size={18} /> Itinerario de Navegación
                </div>
                <div className={styles.crewSummaryText} style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc', marginBottom: '8px' }}>
                  {planState.routeData.origin.name} <span style={{ color: '#94a3b8' }}>➝</span> {planState.routeData.destination.name}
                </div>
                <div className={styles.detailsList} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className={styles.detailRow} style={{ borderLeft: '2px solid #10b981', paddingLeft: '8px' }}>
                    <span className={styles.detailLabel} style={{ fontSize: '11px' }}>Zarpada:</span>
                    <span className={styles.detailValue} style={{ fontSize: '12px' }}>
                      {planState.routeData.departureDate} a las {planState.routeData.departureTime} hs
                    </span>
                  </div>
                  <div className={styles.detailRow} style={{ borderLeft: '2px solid #0284c7', paddingLeft: '8px' }}>
                    <span className={styles.detailLabel} style={{ fontSize: '11px' }}>Arribo Estimado:</span>
                    <span className={styles.detailValue} style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 500 }}>
                      {planState.routeData.arrivalDate} ({planState.routeData.arrivalTime} hs)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Distancia</div>
                      <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 600 }}>{planState.routeData.totalDistance?.toLocaleString()} NM</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Duración</div>
                      <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>{planState.routeData.totalDays || Math.ceil(planState.routeData.etaHours / 24)} Días</div>
                    </div>
                  </div>
                </div>
                <div className={styles.successCheckWrapper}>
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.card} ${styles.cardPending}`} onClick={() => setActiveModal('destination')}>
              <div className={styles.iconWrapper}><Map strokeWidth={1.5} size={72} /></div>
              <h3 className={styles.cardTitle}>Paso 1: Seleccionar Destino</h3>
            </div>
          )}

          {/* Paso 2: Barco */}
          {planState.shipData ? (
            <div className={styles.shipSelectedCard} onClick={() => setActiveModal('ship')}>
              <div className={styles.imageContainer}>
                {planState.shipData.mainImageUrl ? (
                  <img src={planState.shipData.mainImageUrl} alt={planState.shipData.name} className={styles.shipImage} />
                ) : (
                  <div className={styles.noImagePlaceholder}><Sailboat size={48} /></div>
                )}
                <span className={styles.statusBadge}>Operativo</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.shipNameRow}><Sailboat size={20} /> {planState.shipData.name}</div>
                <div className={styles.detailsList}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Tipo de Barco:</span>
                    <span className={styles.detailValue}>
                      {SHIP_TYPE_TRANSLATIONS[planState.shipData.shipType] || planState.shipData.shipType || 'General'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Modelo:</span>
                    <span className={styles.detailValue}>{planState.shipData.registration}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Capacidad:</span>
                    <span className={styles.detailValue}>
                      {planState.shipData.crewCapacity != null ? `${planState.shipData.crewCapacity} Tripulantes` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className={styles.successCheckWrapper}><Check size={20} strokeWidth={3} /></div>
              </div>
            </div>
          ) : (
            <div className={`${styles.card} ${styles.cardPending}`} onClick={() => setActiveModal('ship')}>
              <div className={styles.iconWrapper}><Sailboat strokeWidth={1.5} size={72} /></div>
              <h3 className={styles.cardTitle}>Paso 2: Seleccionar Barco</h3>
            </div>
          )}

          {/* Paso 3: Tripulación */}
          {planState.crewIds.length > 0 ? (
            <div className={styles.shipSelectedCard} onClick={() => setActiveModal('crew')}>
              <div className={styles.crewCardHeaderMock}>
                <div className={styles.crewIconContainer}><Users size={24} /></div>
                <span className={styles.statusBadgeSuccess}>Validada</span>
              </div>
              <div className={styles.cardContent} style={{ paddingTop: '8px' }}>
                <div className={styles.shipNameRow} style={{ marginBottom: '8px' }}>Tripulación Asignada</div>
                <p className={styles.crewSummaryText}>Roles críticos y dotación reglamentaria asignados.</p>
                <div className={styles.avatarStackContainer}>
                  <div className={styles.avatarStack}>
                    <div className={styles.stackAvatarItem}>👨‍✈️</div>
                    <div className={styles.stackAvatarItem} style={{ backgroundColor: '#0284c7' }}>👮</div>
                    <div className={styles.stackAvatarItem} style={{ backgroundColor: '#10b981' }}>🛠️</div>
                    <div className={styles.stackAvatarItem} style={{ backgroundColor: '#f59e0b' }}>⚓</div>
                    {planState.crewIds.length > 4 && (
                      <div className={styles.stackAvatarMore}>+{planState.crewIds.length - 4}</div>
                    )}
                  </div>
                </div>
                <div className={styles.detailsList} style={{ marginTop: 'auto' }}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Total Personal:</span>
                    <span className={styles.detailValue} style={{ color: '#38bdf8', fontWeight: 600 }}>{planState.crewIds.length} Miembros</span>
                  </div>
                </div>
                <div className={styles.successCheckWrapper}><Check size={20} strokeWidth={3} /></div>
              </div>
            </div>
          ) : (
            <div className={`${styles.card} ${styles.cardPending}`} onClick={() => setActiveModal('crew')}>
              <div className={styles.iconWrapper}><Users strokeWidth={1.5} size={72} /></div>
              <h3 className={styles.cardTitle}>Paso 3: Seleccionar Tripulación</h3>
            </div>
          )}

          {/* Paso 4: Carga */}
          {planState.cargoDetails && planState.cargoDetails.length > 0 ? (
            <div className={styles.shipSelectedCard} onClick={() => setActiveModal('cargo')}>
              <div className={styles.imageContainer}>
                <img src={imagenCarga} alt="Manifiesto de Carga" className={styles.shipImage} />
                {planState.cargoDetails.some((c: any) => c.hazardousMaterial) ? (
                  <span className={styles.statusBadgeHazard}>⚠️ Carga IMO</span>
                ) : (
                  <span className={styles.statusBadgeSuccess} style={{ position: 'absolute', top: '12px', right: '12px' }}>Segura</span>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.shipNameRow}><Package size={20} /> Manifiesto de Carga</div>
                <p className={styles.crewSummaryText}>
                  {planState.cargoDetails.map((c: any) => c.productName).slice(0, 2).join(', ')}
                  {planState.cargoDetails.length > 2 ? ` y ${planState.cargoDetails.length - 2} más.` : '.'}
                </p>
                <div className={styles.detailsList} style={{ marginTop: 'auto' }}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Peso Total:</span>
                    <span className={styles.detailValue}>
                      {planState.cargoDetails.reduce((sum: number, c: any) => sum + (Number(c.quantity || 0) * Number(c.weightTonnes || 0)), 0).toLocaleString()} Tons
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Volumen Total:</span>
                    <span className={styles.detailValue}>
                      {planState.cargoDetails.reduce((sum: number, c: any) => sum + (Number(c.quantity || 0) * Number(c.volumeM3 || 0)), 0).toLocaleString()} m³
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Bultos Totales:</span>
                    <span className={styles.detailValue} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      {planState.cargoDetails.reduce((sum: number, c: any) => sum + Number(c.quantity || 0), 0).toLocaleString()} u.
                    </span>
                  </div>
                </div>
                <div className={styles.successCheckWrapper}><Check size={20} strokeWidth={3} /></div>
              </div>
            </div>
          ) : (
            <div className={`${styles.card} ${styles.cardPending}`} onClick={() => setActiveModal('cargo')}>
              <div className={styles.iconWrapper}><Package strokeWidth={1.5} size={72} /></div>
              <h3 className={styles.cardTitle}>Paso 4: Gestionar Carga</h3>
            </div>
          )}
        </div>

        <div className={styles.actionContainer} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            className={`${styles.previewButton} ${isComplete ? styles.previewButtonActive : ''}`}
            disabled={!isComplete || loading}
            onClick={handlePreview}
          >
            {loading ? <span className={styles.spinner}></span> : (isEditMode ? 'Actualizar Plan' : 'Vista Previa / Confirmar Plan')}
          </button>
        </div>

        <footer className={styles.footer}>Sistema de Gestión Marítima V.1</footer>

        {activeModal && (
          <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>
                  {activeModal === 'ship' && 'Seleccionar Barco'}
                  {activeModal === 'crew' && 'Seleccionar Tripulación'}
                  {activeModal === 'cargo' && 'Detalles de Carga'}
                </h3>
                <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
              </div>
              <div className={styles.modalBody}></div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <FeedbackModal 
            message={isEditMode ? "Plan de Travesía actualizado correctamente" : "¡Plan de Travesía guardado con éxito!"} 
            onClose={() => {
              setShowSuccessModal(false);
              navigate('/navigation/travel-plans');
            }} 
          />
        )}

        <ConfirmModal
          isOpen={isLeaveAlertOpen}
          title="¿Desea cancelar el Plan de Travesía?"
          description="Si sales ahora, perderás todos los cambios y selecciones asignadas en este asistente de navegación."
          onConfirm={() => {
            setIsLeaveAlertOpen(false);
            navigate('/navigation/travel-plans');
          }}
          onCancel={() => setIsLeaveAlertOpen(false)} 
        />
      </div>
      )}
    </NavigationLayout>
  );
};
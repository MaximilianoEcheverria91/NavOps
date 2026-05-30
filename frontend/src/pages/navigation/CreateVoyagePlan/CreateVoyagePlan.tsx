import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationLayout } from '../../../layouts/NavigationLayout';
import { Sailboat, Map, Users, Package, Check, X } from 'lucide-react';
import styles from './CreateVoyagePlan.module.css';
import { SelectShip } from './SelectShip/SelectShip';
import { SelectCrew } from './SelectCrew/SelectCrew';
import { ManageCargo } from './SelectCargo/ManageCargo/ManageCargo';

type VoyagePlanState = {
  shipId: string | null;
  shipData: any | null; // 🚀 Declaramos la propiedad para que no tire error de TypeScript
  destinationId: string | null;
  crewIds: string[];
  cargoDetails: any | null;
  currentStep: number;
};

// Mock Data
const MOCK_SHIPS = [
  { id: '1', name: 'ARA Almirante Brown' },
  { id: '2', name: 'ARA Libertad' },
  { id: '3', name: 'ARA Patagonia' }
];

const MOCK_DESTINATIONS = [
  { id: '1', name: 'Base Naval Puerto Belgrano' },
  { id: '2', name: 'Base Naval Ushuaia' },
  { id: '3', name: 'Base Naval Mar del Plata' }
];

const MOCK_CREW = [
  { id: '1', name: 'Juan Pérez - Capitán' },
  { id: '2', name: 'Carlos Gómez - Navegante' },
  { id: '3', name: 'Ana Silva - Ing. Máquinas' }
];

export const CreateVoyagePlan: React.FC = () => {
  const navigate = useNavigate();
  
  // 🚀 Agregamos shipData: null al estado inicial para que matchee con el tipo estricto
  const [planState, setPlanState] = useState<VoyagePlanState>({
    shipId: null,
    shipData: null, // 👈 ¡Faltaba esta línea mágica!
    destinationId: null,
    crewIds: [],
    cargoDetails: null,
    currentStep: 1, 
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Calcula progreso
  const completedSteps = [
    planState.shipId !== null,
    planState.destinationId !== null,
    planState.crewIds.length > 0,
    planState.cargoDetails !== null,
  ].filter(Boolean).length;

  const progressPercentage = (completedSteps / 4) * 100;
  const isComplete = completedSteps === 4;

  const handleSelectShip = (id: string, shipData: any) => {
    setPlanState(prev => ({ 
      ...prev, 
      shipId: id, 
      shipData: shipData 
    }));
    setActiveModal(null); // Desmonta el SelectShip
  };

  const handleSelectDestination = (id: string) => {
    setPlanState(prev => ({ ...prev, destinationId: id }));
    setActiveModal(null);
  };

  const handleSelectCrew = (crewIds: string[]) => {
    setPlanState(prev => ({ ...prev, crewIds }));
    setActiveModal(null);
  };

  const handleSetCargo = (cargoList: any[]) => {
    setPlanState(prev => ({ ...prev, cargoDetails: cargoList.length > 0 ? cargoList : null }));
    setActiveModal(null);
  };

  const handlePreview = () => {
    if (isComplete) {
      navigate('/navigation/plan-summary');
    }
  };

  return (
    <NavigationLayout>
      {activeModal === 'ship' ? (
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
        />
      ) : activeModal === 'cargo' ? (
        <ManageCargo
          planId="V012"
          shipCapacityTonnes={planState.shipData?.cargoCapacityTonnes || 5000}
          initialCargoList={planState.cargoDetails || []}
          onSaveSelection={handleSetCargo}
          onCancel={() => setActiveModal(null)}
        />
      ) : (
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Nuevo plan de Travesía</h1>
            <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
          </header>

        {/* Barra de Progreso */}
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

        {/* Grilla de 4 Cards */}
        <div className={styles.grid}>
          
          {/* Card 1: Barco */}
          
          {planState.shipData ? (
            /* 🚀 VISTA CON EL BARCO SELECCIONADO (IGUAL AL FIGMA) */
            <div 
              className={styles.shipSelectedCard} 
              onClick={() => setActiveModal('ship')} // Si hace clic de nuevo, permite cambiarlo
              title="Haga clic para cambiar de barco"
            >
              <div className={styles.imageContainer}>
                {planState.shipData.mainImageUrl ? (
                  <img 
                    src={planState.shipData.mainImageUrl} 
                    alt={planState.shipData.name} 
                    className={styles.shipImage} 
                  />
                ) : (
                  <div className={styles.noImagePlaceholder}>
                    <Sailboat size={48} />
                  </div>
                )}
                <span className={styles.statusBadge}>Operativo</span>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.shipNameRow}>
                  <Sailboat size={20} /> {planState.shipData.name}
                </div>

                <div className={styles.detailsList}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Tipo de Barco:</span>
                    <span className={styles.detailValue}>
                      {planState.shipData.shipType === 'CONTAINER_SHIP' ? 'Portacontenedor' : planState.shipData.shipType || 'General'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Modelo:</span>
                    <span className={styles.detailValue}>
                      {planState.shipData.registration}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Capacidad:</span>
                    <span className={styles.detailValue}>
                      {planState.shipData.crewCapacity != null ? `${planState.shipData.crewCapacity} Tripulantes` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Tilde verde de completado abajo a la derecha */}
                <div className={styles.successCheckWrapper}>
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>
            </div>
          ) : (
            /* 📥 VISTA PENDIENTE ORIGINAL */
            <div 
              className={`${styles.card} ${styles.cardPending}`}
              onClick={() => setActiveModal('ship')}
            >
              <div className={styles.iconWrapper}>
                <Sailboat strokeWidth={1.5} size={72} />
              </div>
              <h3 className={styles.cardTitle}>Agregar Barco</h3>
            </div>
          )}
          {/* Card 2: Destino */}
          <div 
            className={`${styles.card} ${planState.destinationId ? styles.cardCompleted : styles.cardPending}`}
            onClick={() => setActiveModal('destination')}
          >
            {planState.destinationId && (
              <div className={styles.checkIcon}>
                <Check size={24} color="#10b981" strokeWidth={3} />
              </div>
            )}
            <div className={styles.iconWrapper}>
              <Map strokeWidth={1.5} size={72} />
            </div>
            <h3 className={styles.cardTitle}>Agregar destino</h3>
          </div>

          {/* Card 3: Tripulante */}
         {planState.crewIds.length > 0 ? (
            /* 🚀 VISTA CON TRIPULACIÓN ASIGNADA - AVATAR STACK DESIGN */
            <div 
              className={styles.shipSelectedCard} 
              onClick={() => setActiveModal('crew')}
              title="Haga clic para modificar la tripulación"
            >
              {/* Encabezado con Icono y Estado Regulado */}
              <div className={styles.crewCardHeaderMock}>
                <div className={styles.crewIconContainer}>
                  <Users size={24} />
                </div>
                <span className={styles.statusBadgeSuccess}>Validada</span>
              </div>

              <div className={styles.cardContent} style={{ paddingTop: '8px' }}>
                <div className={styles.shipNameRow} style={{ marginBottom: '8px' }}>
                  Tripulación Oficial
                </div>

                <p className={styles.crewSummaryText}>
                  Roles críticos y dotación reglamentaria asignados con éxito.
                </p>

                {/* 👥 AVATAR STACK: Simulación estética de los miembros seleccionados */}
                <div className={styles.avatarStackContainer}>
                  <div className={styles.avatarStack}>
                    <div className={styles.stackAvatarItem}>👨‍✈️</div>
                    <div className={styles.stackAvatarItem} style={{ backgroundColor: '#0284c7' }}>👮</div>
                    <div className={styles.stackAvatarItem} style={{ backgroundColor: '#10b981' }}>🛠️</div>
                    <div className={styles.stackAvatarItem} style={{ backgroundColor: '#f59e0b' }}>⚓</div>
                    {planState.crewIds.length > 4 && (
                      <div className={styles.stackAvatarMore}>
                        +{planState.crewIds.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.detailsList} style={{ marginTop: 'auto' }}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Total Personal:</span>
                    <span className={styles.detailValue} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      {planState.crewIds.length} Miembros
                    </span>
                  </div>
                </div>

                {/* Tilde verde flotante */}
                <div className={styles.successCheckWrapper}>
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>
            </div>
          ) : (
            /* 📥 VISTA PENDIENTE ORIGINAL */
            <div 
              className={`${styles.card} ${styles.cardPending}`}
              onClick={() => setActiveModal('crew')}
            >
              <div className={styles.iconWrapper}>
                <Users strokeWidth={1.5} size={72} />
              </div>
              <h3 className={styles.cardTitle}>Agregar tripulantes</h3>
            </div>
          )}

          {/* Card 4: Carga */}
          {/* Card 4: Carga */}
          {planState.cargoDetails && planState.cargoDetails.length > 0 ? (
            /* 🚀 VISTA CON CARGA ASIGNADA - MANIFIESTO DINÁMICO */
            <div 
              className={styles.shipSelectedCard} 
              onClick={() => setActiveModal('cargo')}
              title="Haga clic para modificar los productos cargados"
            >
              {/* Contenedor de la Imagen Corporativa (Igual que la del Barco) */}
              <div className={styles.imageContainer}>
                {/* Usamos la imagen espectacular de contenedores de tu mockup 'imagen_18.png' */}
                <img 
                  src="/assets/images/cargo-containers.jpg" /* O la ruta local que uses */
                  alt="Manifiesto de Carga" 
                  className={styles.shipImage} 
                />
                
                {/* 🛡️ Alerta Crítica de Materiales Peligrosos (Regulación Marítima IMO) */}
                {planState.cargoDetails.some((c: any) => c.hazardousMaterial) ? (
                  <span className={styles.statusBadgeHazard}>⚠️ Carga IMO</span>
                ) : (
                  <span className={styles.statusBadgeSuccess} style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    Segura
                  </span>
                )}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.shipNameRow}>
                  <Package size={20} /> Manifiesto de Carga
                </div>

                {/* Resumen dinámico del Top de productos cargados */}
                <p className={styles.crewSummaryText}>
                  {planState.cargoDetails.map((c: any) => c.productName).slice(0, 2).join(', ')}
                  {planState.cargoDetails.length > 2 ? ` y ${planState.cargoDetails.length - 2} productos más.` : '.'}
                </p>

                {/* 📊 CÁLCULOS LOGÍSTICOS EN CALIENTE */}
                <div className={styles.detailsList} style={{ marginTop: 'auto' }}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Peso Total:</span>
                    <span className={styles.detailValue}>
                      {planState.cargoDetails.reduce((sum: number, c: any) => sum + Number(c.weightTonnes || 0), 0)} Tons
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Volumen Estiba:</span>
                    <span className={styles.detailValue}>
                      {planState.cargoDetails.reduce((sum: number, c: any) => sum + Number(c.volumeM3 || 0), 0)} m³
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Total Bultos:</span>
                    <span className={styles.detailValue} style={{ color: '#38bdf8', fontWeight: 600 }}>
                      {planState.cargoDetails.reduce((sum: number, c: any) => sum + Number(c.quantity || 0), 0)} u.
                    </span>
                  </div>
                </div>

                {/* Tilde verde de completado abajo a la derecha */}
                <div className={styles.successCheckWrapper}>
                  <Check size={20} strokeWidth={3} />
                </div>
              </div>
            </div>
          ) : (
            /* 📥 VISTA PENDIENTE ORIGINAL */
            <div 
              className={`${styles.card} ${styles.cardPending}`}
              onClick={() => setActiveModal('cargo')}
            >
              <div className={styles.iconWrapper}>
                <Package strokeWidth={1.5} size={72} />
              </div>
              <h3 className={styles.cardTitle}>Agregar carga</h3>
            </div>
          )}
        </div>

        {/* Botón de Confirmación */}
        <div className={styles.actionContainer}>
          <button 
            className={`${styles.previewButton} ${isComplete ? styles.previewButtonActive : ''}`}
            disabled={!isComplete}
            onClick={handlePreview}
          >
            Vista Previa / Confirmar Plan
          </button>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          Sistema de Gestión Marítima V.1
        </footer>

        {/* Modals Mock (Implementados como Overlays nativos) */}
        {activeModal && (
          <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>
                  {activeModal === 'ship' && 'Seleccionar Barco'}
                  {activeModal === 'destination' && 'Seleccionar Destino'}
                  {activeModal === 'crew' && 'Seleccionar Tripulación'}
                  {activeModal === 'cargo' && 'Detalles de Carga'}
                </h3>
                <button className={styles.closeBtn} onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.modalBody}>
                {/* Ship selection is now a full screen view, so we don't render it in the modal */}

                {activeModal === 'destination' && (
                  <div className={styles.listContainer}>
                    {MOCK_DESTINATIONS.map(dest => (
                      <div 
                        key={dest.id} 
                        className={`${styles.listItem} ${planState.destinationId === dest.id ? styles.listItemSelected : ''}`}
                        onClick={() => handleSelectDestination(dest.id)}
                      >
                        {dest.name}
                      </div>
                    ))}
                  </div>
                )}



              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </NavigationLayout>
  );
};

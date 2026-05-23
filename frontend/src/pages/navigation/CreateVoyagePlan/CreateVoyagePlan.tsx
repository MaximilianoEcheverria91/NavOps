import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationLayout } from '../../../layouts/NavigationLayout';
import { Sailboat, Map, Users, Package, Check, X } from 'lucide-react';
import styles from './CreateVoyagePlan.module.css';
import { SelectShip } from './SelectShip/SelectShip';
import { SelectCrew } from './SelectCrew/SelectCrew';

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

  const handleSetCargo = () => {
    setPlanState(prev => ({ ...prev, cargoDetails: { type: 'General', weight: 5000 } }));
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
        />
      ) : activeModal === 'crew' ? (
        <SelectCrew
          onSelectCrew={handleSelectCrew}
          onCancel={() => setActiveModal(null)}
          initialSelectedIds={planState.crewIds}
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
                    <span className={styles.detailValue}>{planState.shipData.registration || 'Carga'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Modelo:</span>
                    <span className={styles.detailValue}>{planState.shipData.name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Capacidad:</span>
                    <span className={styles.detailValue}>
                      {planState.shipData.imoNumber ? planState.shipData.imoNumber.toLocaleString() : 'N/A'} Toneladas
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
          <div 
            className={`${styles.card} ${planState.crewIds.length > 0 ? styles.cardCompleted : styles.cardPending}`}
            onClick={() => setActiveModal('crew')}
          >
            {planState.crewIds.length > 0 && (
              <div className={styles.checkIcon}>
                <Check size={24} color="#10b981" strokeWidth={3} />
              </div>
            )}
            <div className={styles.iconWrapper}>
              <Users strokeWidth={1.5} size={72} />
            </div>
            <h3 className={styles.cardTitle}>Agregar tripulantes</h3>
          </div>

          {/* Card 4: Carga */}
          <div 
            className={`${styles.card} ${planState.cargoDetails ? styles.cardCompleted : styles.cardPending}`}
            onClick={() => setActiveModal('cargo')}
          >
            {planState.cargoDetails && (
              <div className={styles.checkIcon}>
                <Check size={24} color="#10b981" strokeWidth={3} />
              </div>
            )}
            <div className={styles.iconWrapper}>
              <Package strokeWidth={1.5} size={72} />
            </div>
            <h3 className={styles.cardTitle}>Agregar carga</h3>
          </div>
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


                {activeModal === 'cargo' && (
                  <div className={styles.cargoMock}>
                    <p>Simular asignación de 5000 Tons de Carga General.</p>
                    <button className={styles.primaryModalBtn} onClick={handleSetCargo}>Asignar Carga</button>
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

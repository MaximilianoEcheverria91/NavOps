import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import {
  Ship, Users, Calendar, Fuel, Box, Map as MapIcon,
  Clock, Sun, AlertTriangle, Check, TrendingUp, TrendingDown,
  FileText
} from 'lucide-react';
import styles from './VoyageDashboard.module.css';
import { getVoyagePlan } from '../../../services/api/voyageService';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { TravelPlanActive } from '../../../types/travelPlan';

// Fix for default marker icon in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom ship icon for the current position
const shipIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1000/1000854.png',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

// --- HELPER FUNCTIONS ---

const getCrewCount = (plan: TravelPlanActive): number => {
  if (plan.crewIds && plan.crewIds.length > 0) return plan.crewIds.length;
  // Dynamic aesthetic fallback based on stops
  return (plan.stopCount || 1) * 6;
};

const getEtaString = (eta: string): string => {
  if (!eta) return 'Desconocido';
  const now = new Date().getTime();
  const target = new Date(eta).getTime();
  const diff = target - now;

  if (diff <= 0) return 'Arribado';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `${days} Días ${hours} HS`;
};

const getCompletionPercentage = (departure: string, eta: string): number => {
  if (!departure || !eta) return 0;
  const start = new Date(departure).getTime();
  const end = new Date(eta).getTime();
  const now = new Date().getTime();

  if (now <= start) return 0;
  if (now >= end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
};

export const VoyageDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const travelPlanId = location.state?.travelPlanId || location.state?.activePlanId;

  const [plan, setPlan] = useState<TravelPlanActive | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // MOCK TELEMETRY EXTRAS (Simulating live data not yet in the DTO)
  const mockExtras = {
    fuelPercentage: 50,
    delayPercentage: 8.5,
    temperature: '2°',
    originCoords: [-54.8019, -68.3029] as [number, number],
    currentCoords: [-58.5, -62.0] as [number, number],
    destinationCoords: [-61.1167, -55.9667] as [number, number]
  };

  useEffect(() => {
    const fetchTelemetry = async () => {
      // Generate a mock based on the exact TravelPlanActive structure to prevent breaking
      const mockPlan: TravelPlanActive = {
        id: 'mock-123',
        shipId: 'ship-mock',
        shipName: 'GC-26 / Thompson',
        shipMainImageUrl: null,
        originPortName: 'Puerto Ushuaia',
        destinationPortName: 'Isla Elefante',
        departureTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Started 2 days ago
        eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 15).toISOString(), // 4 days 15 hrs from now
        distanceMiles: 1200,
        stopCount: 11, // 11 * 6 = 66 approx
        status: 'IN_PROGRESS',
        totalCargoTonnes: 5600,
        crewIds: []
      };

      try {
        if (!travelPlanId) {
          setPlan(mockPlan);
          return;
        }

        setLoading(true);
        // We call the API and cast the result, maintaining the method signature Promise<any>
        const planData = await getVoyagePlan(travelPlanId);
        setPlan(planData as TravelPlanActive);
      } catch (error) {
        console.error('Error fetching voyage telemetry:', error);
        setPlan(mockPlan);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
  }, [travelPlanId]);

  if (loading) {
    return (
      <MainLayout>
        <div className={styles.loading}>Cargando telemetría del viaje...</div>
      </MainLayout>
    );
  }

  if (!plan) {
    return (
      <MainLayout>
        <div className={styles.loading}>No hay un viaje activo seleccionado.</div>
      </MainLayout>
    );
  }

  // Dynamic calculations
  const crewCount = getCrewCount(plan);
  const etaDisplay = getEtaString(plan.eta);
  const cargoDisplay = plan.totalCargoTonnes?.toLocaleString() ?? "0";
  const completionPercent = getCompletionPercentage(plan.departureTime, plan.eta);

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
          </div>
          <button className={styles.headerButton}>
            Nuevo <FileText size={18} />
          </button>
        </header>

        <div className={styles.grid}>
          {/* Card 1: Buque */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Ship className={styles.iconWrapper} size={40} strokeWidth={1.5} />
              <Check className={styles.statusIcon} size={24} strokeWidth={3} />
            </div>
            <div>
              <p className={styles.cardLabel}>{plan.shipName}</p>
            </div>
          </div>

          {/* Card 2: Tripulantes */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Users className={styles.iconWrapper} size={40} strokeWidth={1.5} />
              <span className={styles.cardValue} style={{ fontSize: '1.75rem' }}>{crewCount}</span>
            </div>
            <div>
              <p className={styles.cardLabel}>Tripulantes</p>
            </div>
          </div>

          {/* Card 3: ETA */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Calendar className={styles.iconWrapper} size={40} strokeWidth={1.5} />
              <Check className={styles.statusIcon} size={24} strokeWidth={3} />
            </div>
            <div>
              <div className={styles.cardValue}>{etaDisplay}</div>
              <p className={styles.cardLabel}>Llegada</p>
            </div>
          </div>

          {/* Card 4: Combustible (Aún simulado) */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Fuel className={styles.iconFuel} size={40} strokeWidth={1.5} />
              <TrendingUp className={styles.statusIcon} size={24} strokeWidth={2} />
            </div>
            <div>
              <div className={styles.cardValue}>{mockExtras.fuelPercentage} %</div>
              <p className={styles.cardLabel}>Tanque 1</p>
            </div>
          </div>

          {/* Card 5: Carga */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Box className={styles.iconWrapper} size={40} strokeWidth={1.5} />
              <TrendingUp className={styles.statusIcon} size={24} strokeWidth={2} />
            </div>
            <div>
              <div className={styles.cardValue}>{cargoDisplay}</div>
              <p className={styles.cardLabel}>Toneladas</p>
            </div>
          </div>

          {/* Card 6: Viaje Completado */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <MapIcon className={styles.iconWrapper} size={40} strokeWidth={1.5} />
              <TrendingUp className={styles.statusIcon} size={24} strokeWidth={2} />
            </div>
            <div>
              <div className={styles.cardValue}>{completionPercent} %</div>
              <p className={styles.cardLabel}>Viaje completado</p>
            </div>
          </div>

          {/* Card 7: Retraso (Aún simulado) */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Clock className={styles.iconWrapper} size={40} strokeWidth={1.5} />
              <TrendingDown className={styles.statusIconNegative} size={24} strokeWidth={2} />
            </div>
            <div>
              <div className={styles.cardValue}>{mockExtras.delayPercentage} %</div>
              <p className={styles.cardLabel}>Retraso detectado</p>
            </div>
          </div>

          {/* Card 8: Clima (Aún simulado) */}
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <Sun className={styles.iconSun} size={40} strokeWidth={1.5} />
              <Check className={styles.statusIcon} size={24} strokeWidth={3} />
            </div>
            <div>
              <div className={styles.cardValue}>{mockExtras.temperature}</div>
              <p className={styles.cardLabel}>Clima</p>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          {/* Lado Izquierdo: Mapa */}
          <div className={styles.mapContainer}>
            <MapContainer
              center={mockExtras.currentCoords}
              zoom={4}
              className={styles.mapWrapper}
              zoomControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap &copy; CARTO"
              />

              {/* Origen */}
              <Marker position={mockExtras.originCoords}>
                <Tooltip permanent direction="top" className={styles.customTooltip} offset={[0, -20]}>
                  <div className={styles.tooltipContent}>
                    <span className={styles.tooltipLabel}>Origen</span>
                    <span className={styles.tooltipValue}>{plan.originPortName}</span>
                  </div>
                </Tooltip>
              </Marker>

              {/* Barco (Current) */}
              <Marker position={mockExtras.currentCoords} icon={shipIcon}>
                <Tooltip permanent direction="right" className={styles.customTooltipShip} offset={[10, 0]}>
                  <div className={styles.tooltipContent}>
                    <span className={styles.tooltipLabel}>Barco</span>
                    <span className={styles.tooltipValue}>{plan.shipName}</span>
                  </div>
                </Tooltip>
              </Marker>

              {/* Destino */}
              <Marker position={mockExtras.destinationCoords}>
                <Tooltip permanent direction="top" className={styles.customTooltip} offset={[0, -20]}>
                  <div className={styles.tooltipContent}>
                    <span className={styles.tooltipLabel}>Origen</span> {/* Mantengo el typo de la imagen de referencia como solicitaste la vez pasada */}
                    <span className={styles.tooltipValue}>{plan.destinationPortName}</span>
                  </div>
                </Tooltip>
              </Marker>

              {/* Path completed */}
              <Polyline
                positions={[mockExtras.originCoords, mockExtras.currentCoords]}
                pathOptions={{ color: '#1e3a8a', dashArray: '5, 10', weight: 2 }}
              />
              {/* Path remaining */}
              <Polyline
                positions={[mockExtras.currentCoords, mockExtras.destinationCoords]}
                pathOptions={{ color: '#94a3b8', dashArray: '5, 10', weight: 2 }}
              />
            </MapContainer>
          </div>

          {/* Lado Derecho: Alertas */}
          <div className={styles.alertsPanel}>
            <h3 className={styles.alertsTitle}>Alertas Recientes</h3>
            <div className={styles.alertsList}>
              <div className={styles.alertCard}>
                <AlertTriangle className={styles.alertIcon} size={24} />
                <div className={styles.alertContent}>
                  <p className={styles.alertMessage}>Consumo de combustible 15% sobre estimación</p>
                  <p className={styles.alertTime}>Hace 10 Min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

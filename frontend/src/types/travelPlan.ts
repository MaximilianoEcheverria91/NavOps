

export const TRAVEL_PLAN_STATUS = [
    { value: 'PLANNED', label: 'Planificado'},
    { value: 'IN_PROGRESS', label: 'En curso' },
    { value: 'COMPLETED', label: 'Completado' },
    { value: 'CANCELLED', label: 'Cancelado' },
    { value: 'DELAYED', label: 'Demorado'}
];

export interface TravelPlanMetrics {
  scheduledCount: number;
  totalCompletedCount: number;
}

export type TravelPlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'EN_ROUTE' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';

export interface TravelPlanActive {
id: string;
  shipId: string;
  shipName: string;
  shipMainImageUrl: string | null;
  originPortName: string;
  destinationPortName: string;
  departureTime: string; // ISO String
  eta: string;           // ISO String
  distanceMiles: number;
  stopCount: number;
  status: TravelPlanStatus;
  
  // 🚀 AGREGAMOS ESTOS DOS PARA LAS METRICAS REALES DEL DASHBOARD
  totalCargoTonnes?: number; 
  crewIds?: string[];
}

export interface PortCoords {
  name: string;
  latitude: number;
  longitude: number;
}

export interface StopCoords {
  portName: string;
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface TravelPlanTelemetryResponse {
  id: string;
  shipName: string;
  status: string;
  crewCount: number;
  departureTime: string;
  eta: string;
  fuelPercentage: number;
  totalCargoTonnes: number;
  delayHours: number;
  currentEngineStatus: string;
  currentLatitude: number;
  currentLongitude: number;
  origin: PortCoords;
  destination: PortCoords;
  stops: StopCoords[];
}
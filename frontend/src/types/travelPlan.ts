

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
  departureTime: string;
  eta: string;
  distanceMiles: number;
  stopCount: number;
  status: TravelPlanStatus;
}
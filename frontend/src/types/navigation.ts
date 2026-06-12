export interface GlobalVoyagesMetrics {
  inProgressCount: number;
  plannedCount: number;
  delayedCount: number;
  totalCount: number;
}

export interface MyVoyagesMetrics {
  completedCount: number;
  plannedCount: number;
  cancelledCount: number;
  totalCount: number;
}

export interface HistoryVoyagesMetrics {
  completedCount: number;
  cancelledCount: number;
  totalCount: number;
}

export interface VoyageSummary {
  id: string;
  shipName: string;
  originPortName: string;
  destinationPortName: string;
  departureTime: string; // ISO date string
  eta: string; // ISO date string
  status: 'PLANNED' | 'IN_PROGRESS' | 'EN_ROUTE' | 'COMPLETED' | 'CANCELLED';
}

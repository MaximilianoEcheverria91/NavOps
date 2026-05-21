export type NavigationPlanStatus = 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface NavigationRouteResponse {
  id: string;
  originPortId: string | null;
  originPortName: string | null;
  destinationPortId: string | null;
  destinationPortName: string | null;
  departureTime: string | null;
  estimatedArrivalTime: string | null;
  distanceNauticalMiles: number | null;
  notes: string | null;
}

export interface NavigationCargoResponse {
  id: string;
  cargoType: string;
  weightTonnes: number;
  description: string | null;
}

export interface PlanCrewResponse {
  crewMemberId: string;
  fullName: string;
  assignedRole: string;
}

export interface NavigationPlanDetailResponse {
  id: string;
  name: string;
  status: NavigationPlanStatus;
  shipId: string | null;
  shipName: string | null;
  shipRegistration: string | null;
  shipStatus: string | null;
  route: NavigationRouteResponse | null;
  crew: PlanCrewResponse[];
  totalCrewCount: number;
  cargo: NavigationCargoResponse[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationPlanSummaryResponse {
  id: string;
  name: string;
  status: NavigationPlanStatus;
  shipName: string | null;
  originPortName: string | null;
  destinationPortName: string | null;
  departureTime: string | null;
  createdAt: string;
}

export interface NavigationPlanCreateRequest {
  name: string;
  shipId: string;
  originPortId?: string;
  destinationPortId?: string;
  departureTime?: string;
  estimatedArrivalTime?: string;
  distanceNauticalMiles?: number;
  notes?: string;
}

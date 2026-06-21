export interface VoyageFullDetailShip {
  id: string;
  name: string;
  shipType: string;
  registration: string;
  status: string;
  holdCount: number;
  cargoCapacityTonnes: number;
  hullNumber: string;
  mainImageUrl: string;
}

export interface VoyageFullDetailStop {
  id: string;
  portName: string;
  sequence: number;
  estBoardingTime: string;
  estDisembarkTime: string;
  latitude: number;  // <-- Agregado
  longitude: number; // <-- Agregado
}

export interface VoyageFullDetailRoute {
  originPortName: string;
  destinationPortName: string;
  departureTime: string;
  eta: string;
  distanceMiles: number;
  estimatedHours: number;
  stopsCount: number;
  stops: VoyageFullDetailStop[];
  originLatitude: number;       // <-- Agregado
  originLongitude: number;      // <-- Agregado
  destinationLatitude: number;  // <-- Agregado
  destinationLongitude: number; // <-- Agregado
}

export interface VoyageFullDetailCargoItem {
  id: string;
  productName: string;
  owningCompany: string;
  productCategory: string;
  cargoType: string;
  quantity: number;
  weightTonnes: number;
  volumeM3: number;
  containerType: string;
}

export interface VoyageFullDetailCargo {
  totalCargoTonnes: number;
  shipCargoCapacityTonnes: number;
  items: VoyageFullDetailCargoItem[];
}

export interface VoyageFullDetailCrewMember {
  id: string;
  fullName: string;
  role: string;
  fileNumber: string;
  avatarUrl: string;
}

export interface VoyageFullDetailResponse {
  id: string;
  status: string;
  createdAt: string;
  ship: VoyageFullDetailShip;
  route: VoyageFullDetailRoute;
  cargo: VoyageFullDetailCargo;
  crewMembers: VoyageFullDetailCrewMember[];
}

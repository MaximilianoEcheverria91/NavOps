
export type ShipStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'REPAIR' | 'OUT_OF_SERVICE';


export interface ShipSummaryResponse {
  id: string;
  name: string;
  registration: string;
  imoNumber: string;
  mainImageUrl: string | null;
  status: ShipStatus;
}

export interface ShipDetailResponse extends ShipSummaryResponse {
  shipType: string;
  buildYear: number;
  countryName: string | null;
  hullNumber: string | null;
  length: number;
  beam: number;
  draft: number;
  depth: number;
  crewCapacity: number;
  weightTonnes: number;
  holdCount: number | null;
  cargoCapacityTonnes: number;
  engineManufacturer: string | null;
  engineModel: string | null;
  engineSerialNumber: string | null;
  currentEngineHours: number | null;
  lastTboEngineHours: number | null;
  fuelCapacityLiters: number | null;
  lastMaintenanceDate: string | null;
}

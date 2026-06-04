
export type ShipStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'REPAIR' | 'OUT_OF_SERVICE' | 'IN_TRANSIT' | 'INACTIVE';
export type ShipType = 'CONTAINER_SHIP' | 'BULK_CARRIER' | 'TANKER' | 'RO_RO' | 'FISHING_VESSEL' |
                       'CRUISE_SHIP' | 'FERRY' | 'PASSENGER_SHIP' | 'SUPPLY_SHIP' | 'TUGBOAT' | 
                       'AIRCRAFT_CARRIER' | 'DESTROYER' | 'FRIGATE' | 'CORVETTE' | 'SUBMARINE' | 
                       'PATROL_BOAT' | 'LANDING_SHIP' | 'YACHT' | 'SAILBOAT' | 'SPEEDBOAT' | 
                       'RESEARCH_VESSEL' | 'TRAINING_SHIP' | 'HOSPITAL_SHIP' | 'PILOT_BOAT' | 
                       'BARGE' | 'ICEBREAKER' | 'OTHER' | 'NOTICE_SHIP' | 'OCEAN_PATROL_OPV';


export interface ShipSummaryResponse {
  id: string;
  name: string;
  registration: string;
  imoNumber: string;
  mainImageUrl: string | null;
  status: ShipStatus;
}

export interface ShipActiveSelect {
  id: string;
  name: string;
  shipType : ShipType
  registration: string;
  status: ShipStatus;
  crewCapacity: number;
  cargoCapacityTonnes: number;
  mainImageUrl: string | null;
  isActive: boolean;
  
}

export interface ShipDetailResponse extends ShipSummaryResponse {
  shipType: ShipType;
  buildYear: number;
  countryId?: string | null;
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

export interface ShipEditData {
  name: string;
  imoNumber: string;
  registration: string;
  shipType: string;
  buildYear: number;
  countryId: string;
  status: string;
  hullNumber: string | null;
  holdCount: number | null;
  length: number;
  beam: number;
  draft: number;
  depth: number;
  weightTonnes: number;
  crewCapacity: number;
  cargoCapacityTonnes: number;
  engineManufacturer: string | null;
  engineModel: string | null;
  engineType: string | null;
  powerHp: number | null;
  serialNumber: string | null;
  lastTboEngineHours: number | null;
  tankName: string | null;
  contentType: string | null;
  fuelCapacityLiters: number | null;
}

export interface ShipEditRequest {
  data: ShipEditData;
  image?: string | File | null;
}

export interface ShipFilterRequest {
  shipTypes?: string[];
  countryId?: string;
  statuses?: string[];
  minBuildYear?: number | null;
  maxBuildYear?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  minBeam?: number | null;
  maxBeam?: number | null;
  minDraft?: number | null;
  maxDraft?: number | null;
  minDepth?: number | null;
  maxDepth?: number | null;
  minCargoCapacityTonnes?: number | null;
  maxCargoCapacityTonnes?: number | null;
  minCrewCapacity?: number | null;
  maxCrewCapacity?: number | null;
  minHoldCount?: number | null;
  maxHoldCount?: number | null;
  minMaxCapacityLiters?: number | null;
  maxMaxCapacityLiters?: number | null;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}




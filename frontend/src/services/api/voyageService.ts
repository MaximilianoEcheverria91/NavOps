import { apiClient } from '../../api/apiClient';

export interface StopRequest {
  portId: string;
  sequence: number;
  estBoardingTime: string;
  estDisembarkTime: string;
}

export interface CargoItemRequest {
  productName: string;
  productCategory: string;
  productType: string;
  cargoType: string;
  quantity: number;
  weightTonnes: number;
  volumeM3: number;
  owningCompany: string;
  containerType: string;
  hazardousMaterial: boolean;
  description: string;
}

export interface VoyagePlanRequest {
  shipId: string;
  originPortId: string;
  destinationPortId: string;
  departureTime: string; // ISO OffsetDateTime
  eta: string; // ISO OffsetDateTime
  distanceMiles: number;
  estimatedHours: number;
  totalCargoTonnes: number;
  stops: StopRequest[];
  crewIds: string[];
  cargoItems: CargoItemRequest[];
}

export const createVoyagePlan = async (request: VoyagePlanRequest): Promise<any> => {
  const response = await apiClient.post('/navigation/travel-plans', request);
  return response.data;
};

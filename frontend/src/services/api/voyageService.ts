import { apiClient } from '../../api/apiClient';
import axios from 'axios';
import type { GlobalVoyagesMetrics, MyVoyagesMetrics, HistoryVoyagesMetrics, VoyageSummary } from '../../types/navigation';

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

export const updateVoyagePlan = async (id: string, request: VoyagePlanRequest): Promise<any> => {
  const response = await apiClient.put(`/navigation/travel-plans/${id}`, request);
  return response.data;
};

export const getVoyagePlan = async (id: string): Promise<any> => {
  const response = await apiClient.get(`/navigation/travel-plans/${id}`);
  return response.data;
};

export const cancelVoyagePlan = async (id: string): Promise<any> => {
  // 🚀 CORREGIDO: Usamos apiClient para arrastrar los interceptores, headers y baseURL nativos
  const response = await apiClient.patch(`/navigation/travel-plans/${id}/cancel`);
  return response.data;
};

export const getGlobalVoyagesMetrics = async (): Promise<GlobalVoyagesMetrics> => {
  const response = await apiClient.get('/navigation/travel-plans/global-voyages/metrics');
  return response.data;
};

export const getMyVoyagesMetrics = async (): Promise<MyVoyagesMetrics> => {
  const response = await apiClient.get('/navigation/travel-plans/my-voyages/metrics');
  return response.data;
};

export const getHistoryVoyagesMetrics = async (): Promise<HistoryVoyagesMetrics> => {
  const response = await apiClient.get('/navigation/travel-plans/history-voyages/metrics');
  return response.data;
};

export const getMyAssignedVoyages = async (): Promise<VoyageSummary[]> => {
  const response = await apiClient.get('/navigation/travel-plans/my-voyages');
  return response.data;
};

export const startTravelPlan = async (id: string): Promise<any> => {
  const response = await apiClient.patch(`/navigation/travel-plans/${id}/start`);
  return response.data;
};
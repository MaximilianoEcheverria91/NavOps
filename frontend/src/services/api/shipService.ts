import { apiClient } from '../../api/apiClient';
import type { ShipSummaryResponse, ShipDetailResponse, ShipFilterRequest } from '../../types/ship';
import type { PaginatedFilterResponse } from './filterService';

export const getAllShips = async (): Promise<ShipSummaryResponse[]> => {
  const response = await apiClient.get('/admin/ships/');
  return response.data;
};

export const getShipById = async (id: string): Promise<ShipDetailResponse> => {
  const response = await apiClient.get(`/admin/ships/${id}`);
  return response.data;
};

export const createShip = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/admin/ships/create-ship', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateShip = async (id: string, request: any): Promise<void> => {
  // We check if request is FormData, otherwise send as JSON
  const isFormData = request instanceof FormData;
  const response = await apiClient.put(`/admin/ships/${id}`, request, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

export const getFilteredShips = async (filters: ShipFilterRequest): Promise<PaginatedFilterResponse<ShipSummaryResponse>> => {
  const response = await apiClient.post('/admin/ships/filters', filters);
  return response.data;
};



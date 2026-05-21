import { apiClient } from '../../api/apiClient';
import type { PortDetailedResponse, PortSummaryResponse } from '../../types/port';


export const getAllPorts = async (): Promise<PortSummaryResponse[]> => {
  const response = await apiClient.get('/admin/ports/allPorts-active');
  return response.data;
};

export const createPort = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/admin/ports/create-port', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePort = async (id: string, formData: FormData): Promise<any> => {
  const response = await apiClient.put(`/admin/ports/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPortById = async (id: string): Promise<PortDetailedResponse> => {
  const response = await apiClient.get(`/admin/ports/${id}`);
  return response.data;
};

export const deletePort = async (id: string): Promise<void> => {
  await apiClient.patch(`/admin/ports/${id}/deactivate`);
};

export const reactivatePort = async (id: string): Promise<void> => {
  await apiClient.patch(`/admin/ports/${id}/reactivate`);
};
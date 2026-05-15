import { apiClient } from '../../api/apiClient';

export interface PortSummaryResponse {
  id: string;
  mainImageUrl: string | null;
  name: string;
  code: string;
  countryName: string;
  provinceName: string;
  cityName: string;
  status: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
}

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

export interface PortDetailedResponse {
  id: string;
  name: string;
  code: string;
  portType: string;
  dockType: string;
  latitude: number;
  longitude: number;
  dockCount: number;
  maxLength: number;
  maxDraft: number;
  country: string;
  province: string;
  city: string;
  mainImageUrl: string | null;
  contactPhone: string;
  contactEmail: string;
  contactWeb: string;
  timezone: string;
  status: string;
  isActive: boolean;
}

export const getPortById = async (id: string): Promise<PortDetailedResponse> => {
  const response = await apiClient.get(`/admin/ports/${id}`);
  return response.data;
};

export const deletePort = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/ports/${id}`);
};
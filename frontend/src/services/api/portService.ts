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


export interface PortResponse {
  id: string;
  name: string;
  portType: string;
  dockType: string;
  code: string;
  contactPhone: string;
  contactEmail: string;
  contactWeb: string;
  timezone: string;
  latitude: number;
  longitude: number;
  dockCount: number;
  maxLength: number;
  maxDraft: number;
  country: string;
  province: string;
  city: string;
  mainImageUrl: string;
  status: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'CLOSED' | 'FULL';
  isActive: boolean;
}

export const getPortById = async (id: string): Promise<PortResponse> => {
  const response = await apiClient.get<PortResponse>(`/admin/ports/${id}`);
  return response.data;
};

export const deletePort = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/ports/${id}`);
};
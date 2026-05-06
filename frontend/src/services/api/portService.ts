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

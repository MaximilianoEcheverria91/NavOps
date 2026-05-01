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
}

export const getAllPorts = async (): Promise<PortSummaryResponse[]> => {
  const response = await apiClient.get('/admin/ports/allPorts-active');
  return response.data;
};

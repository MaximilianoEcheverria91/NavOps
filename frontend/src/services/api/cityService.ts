import { apiClient } from '../../api/apiClient';

export const getCitiesByProvince = async (provinceId: string) => {
  const response = await apiClient.get(`admin/cities/${provinceId}`);
  return response.data;
};
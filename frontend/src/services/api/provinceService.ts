import { apiClient } from '../../api/apiClient';

export const getProvincesByCountry = async (countryId: string) => {
  const response = await apiClient.get(`admin/provinces/${countryId}`);
  return response.data;
};
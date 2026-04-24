import { apiClient } from '../../api/apiClient';

export const getCountries = async () => {
  const res = await apiClient.get('/admin/list-countries');
  return res.data;
};
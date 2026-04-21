import { apiClient } from '../../api/apiClient';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard-stats');
  return response.data;
};
import { apiClient } from '../../api/apiClient';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard-stats');
  return response.data;
};

export const getUserStatusCount = async () => {
  const response = await apiClient.get('/admin/dashboard/users/status-count');
  return response.data;
};

export const getPortStatusCount = async () => {
  const response = await apiClient.get('/admin/dashboard/ports/status-count');
  return response.data;
}
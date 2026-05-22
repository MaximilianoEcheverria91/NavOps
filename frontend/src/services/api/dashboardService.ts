import { ApiLevel, wait } from '@testing-library/user-event/dist/cjs/utils/index.js';
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

export const getShipStatusCount = async () => {
  const response = await apiClient.get('admin/dashboard/ships/status-count');
  return response.data;
}

export const getUserSystemAccesStatusCount = async () => {
  const response = await apiClient.get('admin/dashboard/users/system-access-count');
  return response.data;
}
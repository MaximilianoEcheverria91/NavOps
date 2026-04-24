import { apiClient } from '../../api/apiClient';

export const getRoles = async () => {
  const res = await apiClient.get('/admin/list-roles');
  return res.data;
};
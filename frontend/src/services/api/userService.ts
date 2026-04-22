import { apiClient } from '../../api/apiClient';

export interface UserResponse {
  id: string;
  name: string;
  surname: string;
  position: string;
  fileNumber: string;
  yearsOfService: number;
  systemRole: string;
  maritimeBookNumber: string;
  avatarUrl: string;
  crewMemberStatus: string;
}

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await apiClient.get('/admin/all-user');
  return response.data;
};

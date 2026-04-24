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

export const createUser = async (payload: any) => {
  const response = await apiClient.post('/admin/create-user', payload, {
    // Al usar FormData, el navegador debe generar el boundary nativamente de multipart.
    // Para que el encabezado global de 'application/json' no interfiera, le restamos precedencia:
    transformRequest: [(data, headers) => {
      delete headers['Content-Type'];
      return data;
    }],
  });
  return response.data;
};
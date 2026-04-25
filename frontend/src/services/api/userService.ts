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

export interface UserDetailedResponse {
  id: string;
  documentType: string;
  documentNumber: string;
  cuil: string;
  name: string;
  surname: string;
  nationality: string;
  maritalStatus: string;
  gender: string;
  birthDate: string;
  email: string;
  mobile: string;
  homePhone: string;
  addressStreet: string;
  addressNumber: string;
  addressFloor: string;
  addressDepartment: string;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  countryName: string;
  fileNumber: string;
  maritimeBookNumber: string;
  navigationRole: string;
  category: string;
  hireDate: string;
  yearsOfService: number;
  crewMemberStatus: string;
  username: string;
  systemRole: string;
  avatarUrl: string;
  isActive: boolean;
}

export const getUserById = async (id: string): Promise<UserDetailedResponse> => {
  const response = await apiClient.get(`/admin/user/${id}`);
  return response.data;
};
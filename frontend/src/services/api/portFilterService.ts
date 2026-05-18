import { apiClient } from '../../api/apiClient';
import type { PortFilterRequest, PortFilterSummary } from '../../types/port';
import type { PaginatedFilterResponse } from './filterService'; // Reutilizamos tu interfaz genérica

export const filterPorts = async (filters: PortFilterRequest): Promise<PaginatedFilterResponse<PortFilterSummary>> => {
  const response = await apiClient.post('/admin/ports/filters', filters);
  return response.data;
};
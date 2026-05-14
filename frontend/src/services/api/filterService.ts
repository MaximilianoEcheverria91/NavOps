import { apiClient } from '../../api/apiClient';

export interface PersonnelFilterRequest {
  countryId?: string | null;
  provinceId?: string | null;
  cityId?: string | null;
  minAge?: number | null;
  maxAge?: number | null;
  personalStatuses?: string[];
  workStatuses?: string[];
  positions?: string[];
  minSeniority?: number | null;
  maxSeniority?: number | null;
  entryDateFrom?: string | null;
  entryDateTo?: string | null;
  hasSystemAccess?: boolean | null;
  accessStatuses?: string[];
  roles?: string[];
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PaginatedFilterResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export const filterPersonnel = async (filters: PersonnelFilterRequest) => {
  const response = await apiClient.post('/admin/filters', filters);
  return response.data;
};

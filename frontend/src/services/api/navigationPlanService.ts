import { apiClient } from '../../api/apiClient';
import type {
  NavigationPlanDetailResponse,
  NavigationPlanSummaryResponse,
  NavigationPlanCreateRequest,
} from '../../types/navigationPlan';

const BASE = '/admin/navigation-plans';

export const getAllNavigationPlans = async (): Promise<NavigationPlanSummaryResponse[]> => {
  const response = await apiClient.get(BASE);
  return response.data;
};

export const getNavigationPlanById = async (id: string): Promise<NavigationPlanDetailResponse> => {
  const response = await apiClient.get(`${BASE}/${id}`);
  return response.data;
};

export const createNavigationPlan = async (
  data: NavigationPlanCreateRequest
): Promise<NavigationPlanDetailResponse> => {
  const response = await apiClient.post(BASE, data);
  return response.data;
};

export const deleteNavigationPlan = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE}/${id}`);
};

import { useState } from 'react';
import axios from 'axios';
import type{ CargoRequest } from '../types/cargoType';

export interface CargoFilterState {
  planId: string | null;
  productCategory: string | null;
  cargoType: string | null;
  containerType: string | null;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
}

export const useCargoFilters = (initialPlanId: string | null) => {
  const initialFilters: CargoFilterState = {
    planId: initialPlanId,
    productCategory: null,
    cargoType: null,
    containerType: null,
    page: 0,
    size: 100, // Fetch up to 100 items by default for the grid
    sortBy: 'createdAt',
    sortDirection: 'DESC'
  };

  const [filters, setFilters] = useState<CargoFilterState>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyFilters = async (currentFilters: CargoFilterState): Promise<CargoRequest[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/admin/travel-plans/cargos/filters', currentFilters);
      setFilters(currentFilters);
      // Spring Pageable returns the array inside 'content'
      return response.data.content || [];
    } catch (err: any) {
      console.error('Error applying cargo filters:', err);
      setError('Error al aplicar los filtros');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async (): Promise<CargoRequest[]> => {
    const resetFilters = { ...initialFilters, planId: initialPlanId };
    setFilters(resetFilters);
    return await applyFilters(resetFilters);
  };

  return { filters, setFilters, applyFilters, clearFilters, loading, error };
};

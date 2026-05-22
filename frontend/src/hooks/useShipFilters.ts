import { useState, useEffect } from 'react';
import { getFilteredShips } from '../services/api/shipService';
import type { ShipFilterRequest, ShipSummaryResponse } from '../types/ship';
import type { PaginatedFilterResponse } from '../services/api/filterService';
import { getCountries } from '../services/api/countryService';

export const useShipFilters = () => {
  const defaultFilters: ShipFilterRequest = {
    shipTypes: [],
    countryId: '',
    statuses: [],
    minBuildYear: null,
    maxBuildYear: null,
    minLength: null,
    maxLength: null,
    minBeam: null,
    maxBeam: null,
    minDraft: null,
    maxDraft: null,
    minDepth: null,
    maxDepth: null,
    minCargoCapacityTonnes: null,
    maxCargoCapacityTonnes: null,
    minCrewCapacity: null,
    maxCrewCapacity: null,
    minHoldCount: null,
    maxHoldCount: null,
    minMaxCapacityLiters: null,
    maxMaxCapacityLiters: null,
    page: 0,
    size: 9,
    sortBy: 'name',
    sortDirection: 'asc'
  };

  const [filters, setFilters] = useState<ShipFilterRequest>(defaultFilters);
  const [data, setData] = useState<ShipSummaryResponse[]>([]);
  const [pagination, setPagination] = useState<{ totalElements: number; totalPages: number; page: number }>({
    totalElements: 0,
    totalPages: 0,
    page: 0,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    loadCountries();
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res);
    } catch (e) {
      console.error('Error fetching countries', e);
    }
  };

  const handleFilterChange = (key: keyof ShipFilterRequest, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = async (overrideFilters?: ShipFilterRequest) => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      const filtersToApply = overrideFilters || { ...filters, page: 0 };
      const res: PaginatedFilterResponse<ShipSummaryResponse> = await getFilteredShips(cleanFilters(filtersToApply));
      
      setData(res.content);
      setPagination({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });

      if (overrideFilters) {
        setFilters(overrideFilters);
      } else {
        setFilters(filtersToApply);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al cargar los barcos filtrados');
      setData([]);
    } finally {
      setIsFetching(false);
    }
  };

  const loadMore = async () => {
    if (isFetching || pagination.page + 1 >= pagination.totalPages) return;

    setIsFetching(true);
    try {
      const nextFilters = { ...filters, page: pagination.page + 1 };
      const res: PaginatedFilterResponse<ShipSummaryResponse> = await getFilteredShips(cleanFilters(nextFilters));
      
      setData(prev => [...prev, ...res.content]);
      setPagination({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
      setFilters(nextFilters);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al cargar más barcos');
    } finally {
      setIsFetching(false);
    }
  };

  const resetFilters = () => {
    applyFilters(defaultFilters);
  };

  const cleanFilters = (f: ShipFilterRequest) => {
    const cleaned: any = {};
    for (const [k, v] of Object.entries(f)) {
      if (v !== '' && v !== null && v !== undefined) {
        if (Array.isArray(v)) {
          if (v.length > 0) cleaned[k] = v;
        } else {
          cleaned[k] = v;
        }
      }
    }
    return cleaned as ShipFilterRequest;
  };

  return {
    filters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    loadMore,
    data,
    pagination,
    isFetching,
    errorMsg,
    countries
  };
};

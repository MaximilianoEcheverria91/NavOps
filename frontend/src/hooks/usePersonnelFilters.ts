import { useState, useEffect, useCallback } from 'react';
import { filterPersonnel } from '../services/api/filterService';
import type { PersonnelFilterRequest, PaginatedFilterResponse } from '../services/api/filterService';
import type { UserResponse } from '../services/api/userService';
import { getCountries } from '../services/api/countryService';
import { getProvincesByCountry } from '../services/api/provinceService';
import { getCitiesByProvince } from '../services/api/cityService';

export const usePersonnelFilters = () => {
  const defaultFilters: PersonnelFilterRequest = {
    countryId: '',
    provinceId: '',
    cityId: '',
    minAge: null,
    maxAge: null,
    personalStatuses: [],
    workStatuses: [],
    positions: [],
    minSeniority: null,
    maxSeniority: null,
    entryDateFrom: '',
    entryDateTo: '',
    hasSystemAccess: null,
    accessStatuses: [],
    roles: [],
    page: 0,
    size: 10,
    sortBy: 'name',
    sortDirection: 'asc'
  };

  const [filters, setFilters] = useState<PersonnelFilterRequest>(defaultFilters);
  const [data, setData] = useState<UserResponse[]>([]);
  const [pagination, setPagination] = useState<{ totalElements: number; totalPages: number; page: number }>({
    totalElements: 0,
    totalPages: 0,
    page: 0,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Locations state
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Initial load for countries and first fetch
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

  const loadProvinces = async (countryId: string) => {
    try {
      const res = await getProvincesByCountry(countryId);
      setProvinces(res);
    } catch (e) {
      console.error('Error fetching provinces', e);
    }
  };

  const loadCities = async (provinceId: string) => {
    try {
      const res = await getCitiesByProvince(provinceId);
      setCities(res);
    } catch (e) {
      console.error('Error fetching cities', e);
    }
  };

  const handleFilterChange = (key: keyof PersonnelFilterRequest, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Handle cascading location resets
      if (key === 'countryId') {
        newFilters.provinceId = '';
        newFilters.cityId = '';
        setProvinces([]);
        setCities([]);
        if (value) loadProvinces(value);
      } else if (key === 'provinceId') {
        newFilters.cityId = '';
        setCities([]);
        if (value) loadCities(value);
      }

      return newFilters;
    });
  };

  const applyFilters = async (overrideFilters?: PersonnelFilterRequest) => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      const filtersToApply = overrideFilters || { ...filters, page: 0 };
      const res: PaginatedFilterResponse<UserResponse> = await filterPersonnel(cleanFilters(filtersToApply));
      setData(res.content);
      setPagination({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
      // Sync state if override was provided
      if (overrideFilters) {
        setFilters(overrideFilters);
      } else {
        setFilters(filtersToApply);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error fetching filtered personnel');
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
      const res: PaginatedFilterResponse<UserResponse> = await filterPersonnel(cleanFilters(nextFilters));
      setData(prev => [...prev, ...res.content]);
      setPagination({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
      setFilters(nextFilters);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading more personnel');
    } finally {
      setIsFetching(false);
    }
  };

  const resetFilters = () => {
    setProvinces([]);
    setCities([]);
    applyFilters(defaultFilters);
  };

  // Helper to remove empty strings or nulls to avoid sending unnecessary keys
  const cleanFilters = (f: PersonnelFilterRequest) => {
    const cleaned: any = {};
    for (const [k, v] of Object.entries(f)) {
      if (v !== '' && v !== null && v !== undefined) {
        // If it's an array, only add if not empty
        if (Array.isArray(v)) {
          if (v.length > 0) cleaned[k] = v;
        } else {
          cleaned[k] = v;
        }
      }
    }
    return cleaned as PersonnelFilterRequest;
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
    countries,
    provinces,
    cities
  };
};

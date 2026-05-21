// src/hooks/usePortFilters.ts
import { useState, useEffect } from 'react';
import { filterPorts } from '../services/api/portFilterService';
import type { PortFilterRequest, PortFilterSummary } from '../types/port';
import type { PaginatedFilterResponse } from '../services/api/filterService';
import { getCountries } from '../services/api/countryService';
import { getProvincesByCountry } from '../services/api/provinceService';
import { getCitiesByProvince } from '../services/api/cityService';

export const usePortFilters = () => {
  const defaultFilters: PortFilterRequest = {
    countryId: '',
    provinceId: '',
    cityId: '',
    portTypes: [],
    dockTypes: [],
    statuses: [],
    minDockCount: null,
    maxDockCount: null,
    minMaxLength: null,
    maxMaxLength: null,
    minMaxDraft: null,
    maxMaxDraft: null,
    page: 0,
    size: 9, // Cambiado a 9 porque las grids de 3 columnas (como tus cards) quedan mejor con múltiplos de 3
    sortBy: 'name',
    sortDirection: 'asc'
  };

  const [filters, setFilters] = useState<PortFilterRequest>(defaultFilters);
  const [data, setData] = useState<PortFilterSummary[]>([]);
  const [pagination, setPagination] = useState<{ totalElements: number; totalPages: number; page: number }>({
    totalElements: 0,
    totalPages: 0,
    page: 0,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de Ubicación (Geográficos)
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Carga inicial de países y primer fetch de puertos
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

  const handleFilterChange = (key: keyof PortFilterRequest, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Lógica de cascada para los resets geográficos
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

  const applyFilters = async (overrideFilters?: PortFilterRequest) => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      // Si se pasa un override (como al limpiar o sacar un chip), lo usa, si no arranca de la pág 0
      const filtersToApply = overrideFilters || { ...filters, page: 0 };
      const res: PaginatedFilterResponse<PortFilterSummary> = await filterPorts(cleanFilters(filtersToApply));
      
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
      setErrorMsg(err?.message || 'Error al cargar los puertos filtrados');
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
      const res: PaginatedFilterResponse<PortFilterSummary> = await filterPorts(cleanFilters(nextFilters));
      
      setData(prev => [...prev, ...res.content]);
      setPagination({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
      setFilters(nextFilters);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al cargar más puertos');
    } finally {
      setIsFetching(false);
    }
  };

  const resetFilters = () => {
    setProvinces([]);
    setCities([]);
    applyFilters(defaultFilters);
  };

  // Limpiador de request para no mandar campos vacíos al @RequestBody de Spring Boot
  const cleanFilters = (f: PortFilterRequest) => {
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
    return cleaned as PortFilterRequest;
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
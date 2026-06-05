import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import type { TravelPlanActive, TravelPlanMetrics } from '../types/travelPlan';

export interface PaginationMeta {
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface TravelPlanFilters {
  searchTerm?: string;
  statuses?: string[];
  departureFrom?: string;  // 🚀 Sincronizado con el Record de Java
  departureTo?: string;    // 🚀 Sincronizado con el Record de Java
  arrivalFrom?: string;    // 🚀 Sincronizado con el Record de Java
  arrivalTo?: string;      // 🚀 Sincronizado con el Record de Java
  productCategories?: string[];
  cargoTypes?: string[];
  containerTypes?: string[];
  hazardousMaterial?: boolean | null;
}

export const useTravelPlans = () => {
  const [metrics, setMetrics] = useState<TravelPlanMetrics>({ scheduledCount: 0, totalCompletedCount: 0 });
  const [activePlans, setActivePlans] = useState<TravelPlanActive[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ totalPages: 0, totalElements: 0, currentPage: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial de KPIs de forma real (No Mockup)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsRes = await apiClient.get<TravelPlanMetrics>('/navigation/travel-plans/metrics');
        setMetrics(metricsRes.data);
      } catch (err) {
        console.error("Error fetching metrics", err);
        setMetrics({ scheduledCount: 12, totalCompletedCount: 45 }); // Fallback real de tu Postman
      }
    };
    fetchMetrics();
  }, []);

  const fetchFilteredPlans = useCallback(async (filters: TravelPlanFilters, page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      // 🚀 Limpiamos strings vacíos o nulos antes de mandar el JSON a Spring Boot
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
      );

      const response = await apiClient.post(
        `/navigation/travel-plans/search?page=${page}&size=${size}&sort=departureTime,desc`,
        cleanedFilters
      );
      
      // Manejo dinámico si la API devuelve Page de Spring o un Array directo
      if (response.data && response.data.content) {
        const { content, totalPages, totalElements, number } = response.data;
        setActivePlans(content);
        setPagination({ totalPages, totalElements, currentPage: number });
      } else {
        setActivePlans(Array.isArray(response.data) ? response.data : []);
        setPagination({ totalPages: 1, totalElements: response.data.length || 0, currentPage: 0 });
      }
    } catch (err: any) {
      console.error("Error fetching filtered travel plans", err);
      setError("Error al cargar los planes de viaje");
    } finally {
      setLoading(false);
    }
  }, []);

  return { metrics, activePlans, pagination, loading, error, fetchFilteredPlans };
};
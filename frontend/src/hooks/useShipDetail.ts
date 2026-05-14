import { useState, useEffect } from 'react';
import { getShipById } from '../services/api/shipService';
import type { ShipDetailResponse } from '../types/ship';

export const useShipDetail = (shipId: string) => {
  const [data, setData] = useState<ShipDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipId) return;
    setLoading(true);
    setError(null);
    getShipById(shipId)
      .then(setData)
      .catch(() => setError('No se pudo cargar la información del barco.'))
      .finally(() => setLoading(false));
  } , [shipId]);

  return { data, loading, error };
};
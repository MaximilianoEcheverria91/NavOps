import { useState } from 'react';
import { createVoyagePlan } from '../services/api/voyageService';
import type { VoyagePlanRequest } from '../services/api/voyageService';

const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3440.065;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Convierte un objeto Date nativo al formato estricto OffsetDateTime (+00:00 o -03:00)
const convertDateToOffsetDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMins = pad(absOffset % 60);

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${sign}${offsetHours}:${offsetMins}`;
};

export const useCreateVoyagePlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveVoyagePlan = async (planState: any) => {
    setLoading(true);
    setError(null);

    try {
      if (!planState.shipId) throw new Error("Barco no seleccionado");
      if (!planState.routeData) throw new Error("Ruta no seleccionada");
      if (!planState.crewIds || planState.crewIds.length === 0) throw new Error("Tripulación no asignada");

      const { routeData } = planState;

      // 1. Mapeo seguro de tiempos de Zarpada principal
      const departureDateObj = new Date(`${routeData.departureDate}T${routeData.departureTime}:00`);
      const departureOffsetDateTime = convertDateToOffsetDateTime(departureDateObj);

      // 2. Procesamiento e hidratación de escalas con formateador OffsetDateTime idéntico
      const stops = routeData.stops || [];
      let currentDistance = 0;
      let currentPoint = routeData.origin;

      const stopRequests = stops.map((stop: any, index: number) => {
        const legDistance = calculateHaversineDistance(
          currentPoint.latitude, currentPoint.longitude,
          stop.latitude, stop.longitude
        );
        currentDistance += legDistance;

        const partialEtaHours = currentDistance / 15;
        const arrivalMs = departureDateObj.getTime() + (partialEtaHours * 60 * 60 * 1000);
        const arrivalDate = new Date(arrivalMs);

        // Escala técnica estandarizada de 2 horas
        const disembarkMs = arrivalMs + (2 * 60 * 60 * 1000);
        const disembarkDate = new Date(disembarkMs);

        currentPoint = stop;

        return {
          portId: stop.id,
          sequence: index + 1,
          // 🚀 CORRECCIÓN CRÍTICA: Ahora mandamos el formato OffsetDateTime exacto que pide Java
          estBoardingTime: convertDateToOffsetDateTime(arrivalDate),
          estDisembarkTime: convertDateToOffsetDateTime(disembarkDate)
        };
      });

      // 3. Formateo de Arribo Final
      const arrivalDateObj = new Date(`${routeData.arrivalDate}T${routeData.arrivalTime}:00`);
      const etaOffsetDateTime = convertDateToOffsetDateTime(arrivalDateObj);

      const totalCargoTonnes = planState.cargoDetails
        ? planState.cargoDetails.reduce((sum: number, c: any) => sum + Number(c.weightTonnes || 0), 0)
        : 0;

     const cargoItems = planState.cargoDetails
        ? planState.cargoDetails.map((c: any) => ({
          productName: c.productName,
          productCategory: c.productCategory || "GENERAL",
          productType: c.productType || "GENERAL",
          cargoType: c.cargoType || "BULK",
          quantity: Math.floor(Number(c.quantity || 1)),
          weightTonnes: parseFloat(Number(c.weightTonnes || 0).toFixed(2)),
          volumeM3: parseFloat(Number(c.volumeM3 || 0).toFixed(2)),
          owningCompany: c.owningCompany || "Desconocida",
          
          // 🚀 SOLUCIÓN DEFINITIVA: Si existe c.containerType lo manda, sino manda null puro
          containerType: c.containerType || null, 
          
          hazardousMaterial: !!c.hazardousMaterial,
          description: c.description || ""
        }))
        : [];
        
      // 4. Consolidación de Payload final (Agregando fallbacks numéricos para evitar Nulos)
      const payload: VoyagePlanRequest = {
        shipId: planState.shipId,
        originPortId: routeData.origin.id,
        destinationPortId: routeData.destination.id,
        departureTime: departureOffsetDateTime,
        eta: etaOffsetDateTime,
        distanceMiles: Number(routeData.totalDistance || 0),
        estimatedHours: Number(routeData.etaHours || 0),
        totalCargoTonnes: Number(totalCargoTonnes || 0),
        stops: stopRequests,
        crewIds: planState.crewIds,
        cargoItems
      };

      console.log("🚀 Enviando Payload blindado al backend:", JSON.stringify(payload, null, 2));

      const result = await createVoyagePlan(payload);
      setLoading(false);
      return result;
    } catch (err: any) {
      console.error("❌ Error detectado en el proceso de guardado:", err);
      setError(err.message || "Error al guardar el plan de travesía");
      setLoading(false);
      throw err;
    }
  };

  return { saveVoyagePlan, loading, error };
};
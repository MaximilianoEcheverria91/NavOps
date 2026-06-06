import { useState } from 'react';
import { createVoyagePlan, getVoyagePlan, updateVoyagePlan as apiUpdateVoyagePlan } from '../services/api/voyageService';
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

  const buildPayload = (planState: any): VoyagePlanRequest => {
    if (!planState.shipId) throw new Error("Barco no seleccionado");
    if (!planState.routeData) throw new Error("Ruta no seleccionada");
    if (!planState.crewIds || planState.crewIds.length === 0) throw new Error("Tripulación no asignada");

    const { routeData } = planState;

    const departureDateObj = new Date(`${routeData.departureDate}T${routeData.departureTime}:00`);
    const departureOffsetDateTime = convertDateToOffsetDateTime(departureDateObj);

    const stops = routeData.stops || [];
    let currentDistance = 0;
    let currentPoint = routeData.origin;

    const stopRequests = stops.map((stop: any, index: number) => {
      const legDistance = calculateHaversineDistance(
        currentPoint.latitude || 0, currentPoint.longitude || 0,
        stop.latitude || 0, stop.longitude || 0
      );
      currentDistance += legDistance;

      const partialEtaHours = currentDistance / 15;
      const arrivalMs = departureDateObj.getTime() + (partialEtaHours * 60 * 60 * 1000);
      const arrivalDate = new Date(arrivalMs);

      const disembarkMs = arrivalMs + (2 * 60 * 60 * 1000);
      const disembarkDate = new Date(disembarkMs);

      currentPoint = stop;

      return {
        portId: stop.id || stop.portId,
        sequence: index + 1,
        estBoardingTime: convertDateToOffsetDateTime(arrivalDate),
        estDisembarkTime: convertDateToOffsetDateTime(disembarkDate)
      };
    });

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
        containerType: c.containerType || null, 
        hazardousMaterial: !!c.hazardousMaterial,
        description: c.description || ""
      }))
      : [];
      
    return {
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
  };

  const saveVoyagePlan = async (planState: any) => {
    setLoading(true);
    setError(null);

    try {
      const payload = buildPayload(planState);
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

  const updateVoyagePlan = async (id: string, planState: any) => {
    setLoading(true);
    setError(null);
    try {
      const payload = buildPayload(planState);
      console.log("🚀 Enviando Payload blindado al backend para actualización:", JSON.stringify(payload, null, 2));
      const result = await apiUpdateVoyagePlan(id, payload);
      setLoading(false);
      return result;
    } catch (err: any) {
      console.error("❌ Error detectado en el proceso de actualización:", err);
      setError(err.message || "Error al actualizar el plan de travesía");
      setLoading(false);
      throw err;
    }
  };

  const fetchVoyagePlan = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVoyagePlan(id);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || "Error al obtener el plan");
      setLoading(false);
      throw err;
    }
  };

  return { saveVoyagePlan, updateVoyagePlan, fetchVoyagePlan, loading, error };
};
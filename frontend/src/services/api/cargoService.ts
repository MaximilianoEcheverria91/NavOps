import axios from 'axios';
import type { CargoRequest, CargoResponse } from '../../types/cargoType';

// Cambiá la URL base según cómo tengas configurado tu entorno (ej: http://localhost:8080)
const API_BASE_URL = '/api/navigation/travel-plans';

export const cargoService = {
  /**
   * Obtiene la lista de todos los productos/cargas asociados a un plan de travesía específico.
   * Se usará para llenar la tabla principal y recalcular los indicadores superiores.
   */
  getCargoByPlanId: async (planId: string): Promise<CargoResponse[]> => {
    try {
      const response = await axios.get<CargoResponse[]>(`${API_BASE_URL}/${planId}/cargo`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la carga para el plan ${planId}:`, error);
      throw error;
    }
  },

  /**
   * Guarda un listado completo de cargas (Array) asociado a un plan de travesía.
   * Se llamará al presionar "Guardar" definitivo para impactar en la base de datos.
   */
  saveCargoList: async (planId: string, cargoList: CargoRequest[]): Promise<CargoResponse[]> => {
    try {
      const response = await axios.post<CargoResponse[]>(`${API_BASE_URL}/${planId}/cargo`, cargoList);
      return response.data;
    } catch (error) {
      console.error(`Error al guardar la lista de carga para el plan ${planId}:`, error);
      throw error;
    }
  }
};
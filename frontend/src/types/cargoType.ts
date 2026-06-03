export interface CargoRequest {
  productName: string;
  productCategory: string;
  productType: string;
  cargoType: string;
  quantity: number;
  weightTonnes: number;
  volumeM3: number;
  owningCompany: string;
  containerType: string | null;
  hazardousMaterial: boolean;
  description: string;
  status: 'LOADED' | 'DISPATCHED' | 'RETURNED';
}

export interface CargoResponse extends CargoRequest {
  id: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
}

// Mapeos para mostrar nombres amigables en la UI (Español)
export const CARGO_CATEGORIES = [
  { value: 'WEAPONS', label: 'Armamento' },
  { value: 'FOOD_AND_BEVERAGES', label: 'Alimentos y Bebidas' },
  { value: 'VEHICLES_ACCESSORIES', label: 'Vehiculos y accesorios' },
  { value: 'APPLIANCES_AND_TECHNOLOGY', label: 'Electrodomesticos y Tecnología' },
  { value: 'INDUSTRIAL', label: 'Maquinaria e Industrial' },
  { value: 'PHARMACEUTICAL', label: 'Farmacéutico y Salud' },
  { value: 'HOME_AND_FURNITURE', label: 'Hogar y muebles' },
  { value: 'CLOTHING_FOOTWEAR_AND_ACCESSORIES', label: 'Ropa, calazado y accesorios' },
  { value: 'OTHER', label: 'Otro'}
];

export const CARGO_TYPES = [
  { value: 'BULK', label: 'A Granel' },
  { value: 'CONTAINER', label: 'Contenedor' },
  { value: 'PALLET', label: 'Pallet' },
  { value: 'DRUM', label: 'Tambor / Barril' },
  { value: 'BINER', label: 'Biner'},
  { value: 'OTHER', label: 'Otro'}
];

export const CONTAINER_TYPES = [
  { value: 'DRY_VAN', label: 'Cerrado' },
  { value: 'REEFER', label: 'Refrigerado' },
  { value: 'OPEN_TOP', label: 'Sin Techo' },
  { value: 'HIGH_CUBE', label: 'Cubo alto HC'},
  { value: 'FLAT_RACK', label: 'Plano'},
  { value: 'TANK', label: 'Cisterna' },
  { value: 'OTHER', label: 'Otro'}
];

export const CARGO_STATUS = [
    { value: 'LOADED', label: 'Cargado' },
    { value: 'DISPATCHED', label: 'Despachado' },
    { value: 'DELIVERED', label: 'Entrgado' },
    { value: 'RETURNED', label: 'Devolución' },
    { value: 'CANCELED', label: 'Cancelado'}
];

export interface PortSummaryResponse {
  id: string;
  mainImageUrl: string | null;
  name: string;
  code: string;
  countryName: string;
  provinceName: string;
  cityName: string;
  status: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
}

export interface PortDetailedResponse {
  id: string;
  name: string;
  code: string;
  portType: string;
  dockType: string;
  latitude: number;
  longitude: number;
  dockCount: number;
  maxLength: number;
  maxDraft: number;
  countryId: string;
  provinceId: string;
  cityId: string;
  country: string;
  province: string;
  city: string;
  mainImageUrl: string | null;
  contactPhone: string;
  contactEmail: string;
  contactWeb: string;
  timezone: string;
  status: string;
  isActive: boolean;
}

export type PortStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'CLOSED' | 'FULL' | 'INACTIVE';
export type PortType = 'COMMERCIAL' | 'LOGISTIC' | 'TOURISTIC' | 'INDUSTRIAL' | 'FISHING';
export type DockType = 'SOLID_STRUCTURE' | 'FLOATING' | 'DUQUE_DE_ALVA' | 'JETTY';

export interface PortFilterRequest {
  countryId?: string | null;
  provinceId?: string | null;
  cityId?: string | null;
  portTypes?: PortType[];
  dockTypes?: DockType[];
  statuses?: PortStatus[];
  minDockCount?: number | null;
  maxDockCount?: number | null;
  minMaxLength?: number | null;
  maxMaxLength?: number | null;
  minMaxDraft?: number | null;
  maxMaxDraft?: number | null;
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PortFilterSummary {
  id: string;
  mainImageUrl: string | null;
  name: string;
  code: string;
  countryName: string;
  provinceName: string;
  cityName: string;
  status: PortStatus;
  isActive: boolean;
}
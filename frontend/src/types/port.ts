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
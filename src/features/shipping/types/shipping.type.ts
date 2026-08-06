export interface ShippingDestination {
  id: number;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
}

export interface ShippingServiceOption {
  serviceCode: string;
  serviceName: string;
  etd: string;
  cost: number;
  isRecommended?: boolean;
  isCheapest?: boolean;
}

export interface GroupedCourierOption {
  courierCode: string;
  courierName: string;
  services: ShippingServiceOption[];
}

export interface SelectedShippingOption {
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  etd: string;
  cost: number;
}

export interface GetShippingOptionsPayload {
  originId?: number;
  destinationId: number;
  weight?: number;
  couriers?: string[];
}

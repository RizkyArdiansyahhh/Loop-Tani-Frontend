export type AddressType = "HOME" | "OFFICE" | "OTHER";

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  label: string | null;
  recipientName: string;
  recipientPhone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  subDistrictId: string;
  subDistrictName: string;
  postalCode: string;
  street: string;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  type: AddressType;
  label?: string;
  recipientName: string;
  recipientPhone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  subDistrictId: string;
  subDistrictName: string;
  postalCode: string;
  street: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  isDefault?: boolean;
}

export type UpdateAddressPayload = Partial<Omit<CreateAddressPayload, "isDefault">>;

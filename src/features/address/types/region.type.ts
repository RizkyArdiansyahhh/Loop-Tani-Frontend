export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  provinceId: string;
  name: string;
}

export interface District {
  id: string;
  regencyId: string;
  name: string;
}

export interface Village {
  id: string;
  districtId: string;
  name: string;
}

export enum RegionType {
  PROVINCE = 'PROVINCE',
  REGENCY = 'REGENCY',
  DISTRICT = 'DISTRICT',
  VILLAGE = 'VILLAGE',
}

export interface RegionSearchItem {
  id: string;
  name: string;
  type: RegionType;
  fullName: string;
}

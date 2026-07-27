import { axiosInstance } from "@/lib/axios";
import { Province, Regency, District, Village, RegionSearchItem } from "../types/region.type";

export const regionKeys = {
  all: ["regions"] as const,
  provinces: () => [...regionKeys.all, "provinces"] as const,
  regencies: (provinceId?: string) => [...regionKeys.all, "regencies", provinceId] as const,
  districts: (regencyId?: string) => [...regionKeys.all, "districts", regencyId] as const,
  villages: (districtId?: string) => [...regionKeys.all, "villages", districtId] as const,
  search: (keyword: string) => [...regionKeys.all, "search", keyword] as const,
};

export async function getProvinces(): Promise<Province[]> {
  const { data } = await axiosInstance.get<Province[]>("/regions/provinces");
  return data;
}

export async function getRegencies(provinceId: string): Promise<Regency[]> {
  if (!provinceId) return [];
  const { data } = await axiosInstance.get<Regency[]>("/regions/regencies", {
    params: { provinceId },
  });
  return data;
}

export async function getDistricts(regencyId: string): Promise<District[]> {
  if (!regencyId) return [];
  const { data } = await axiosInstance.get<District[]>("/regions/districts", {
    params: { regencyId },
  });
  return data;
}

export async function getVillages(districtId: string): Promise<Village[]> {
  if (!districtId) return [];
  const { data } = await axiosInstance.get<Village[]>("/regions/villages", {
    params: { districtId },
  });
  return data;
}

export async function searchRegions(keyword: string): Promise<RegionSearchItem[]> {
  if (!keyword || keyword.trim().length < 3) return [];
  const { data } = await axiosInstance.get<RegionSearchItem[]>("/regions/search", {
    params: { keyword },
  });
  return data;
}

import { useQuery } from "@tanstack/react-query";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
  regionKeys,
} from "../api/region.api";

export function useProvinces() {
  return useQuery({
    queryKey: regionKeys.provinces(),
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 60, // 1 jam cache
  });
}

export function useRegencies(provinceId: string) {
  return useQuery({
    queryKey: regionKeys.regencies(provinceId),
    queryFn: () => getRegencies(provinceId),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useDistricts(regencyId: string) {
  return useQuery({
    queryKey: regionKeys.districts(regencyId),
    queryFn: () => getDistricts(regencyId),
    enabled: !!regencyId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useVillages(districtId: string) {
  return useQuery({
    queryKey: regionKeys.villages(districtId),
    queryFn: () => getVillages(districtId),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60,
  });
}

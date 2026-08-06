import { useQuery } from "@tanstack/react-query";
import { shippingApi } from "../api/shipping-api";

export function useSearchDestination(search: string) {
  const queryKey = ["shipping", "destination", search];

  return useQuery({
    queryKey,
    queryFn: () => shippingApi.searchDestination(search),
    enabled: !!search && search.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

import { useQuery } from "@tanstack/react-query";
import { shippingApi } from "../api/shipping-api";
import { GetShippingOptionsPayload } from "../types/shipping.type";

export function useShippingOptions(payload: GetShippingOptionsPayload) {
  const queryKey = [
    "shipping",
    "options",
    payload.originId || 153,
    payload.destinationId,
    payload.weight || 1000,
    ...(payload.couriers || []),
  ];

  return useQuery({
    queryKey,
    queryFn: () => shippingApi.getShippingOptions(payload),
    enabled: !!payload.destinationId && payload.destinationId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes cache for checkout shipping options
  });
}

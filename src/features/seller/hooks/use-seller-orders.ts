import { useQuery } from "@tanstack/react-query";
import { getSellerOrders, type GetSellerOrdersParams } from "../api/get-seller-orders";
import { sellerKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useSellerOrders(params?: GetSellerOrdersParams) {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: sellerKeys.orders(params),
    queryFn: () => getSellerOrders(params),
    enabled: !!session,
    staleTime: 30 * 1000, // 30 seconds cache to prevent duplicate requests
  });
}

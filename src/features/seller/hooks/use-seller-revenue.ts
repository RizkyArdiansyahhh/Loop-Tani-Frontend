import { useQuery } from "@tanstack/react-query";
import { getSellerRevenue } from "../api/get-seller-revenue";
import { sellerKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useSellerRevenue() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: sellerKeys.revenue(),
    queryFn: getSellerRevenue,
    enabled: !!session,
    staleTime: 30 * 1000,
  });
}

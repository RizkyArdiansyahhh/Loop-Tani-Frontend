import { useQuery } from "@tanstack/react-query";
import { getSellerAnalytics } from "../api/get-seller-analytics";
import { sellerKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useSellerAnalytics(period?: string) {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: sellerKeys.analytics(period),
    queryFn: () => getSellerAnalytics(period),
    enabled: !!session,
    staleTime: 30 * 1000,
  });
}

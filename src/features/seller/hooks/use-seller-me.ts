import { useQuery } from "@tanstack/react-query";
import { getSellerMe } from "../api/get-seller-me";
import { sellerKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useSellerMe() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: sellerKeys.me(),
    queryFn: getSellerMe,
    enabled: !!session,
    retry: false, // Don't retry since 404 is expected if not registered
  });
}

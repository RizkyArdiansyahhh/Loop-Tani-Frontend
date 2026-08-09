import { useQuery } from "@tanstack/react-query";
import { getSellerReviews } from "../api/get-seller-reviews";
import { sellerKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useSellerReviews(rating?: number) {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: sellerKeys.reviews(rating),
    queryFn: () => getSellerReviews(rating),
    enabled: !!session,
    staleTime: 30 * 1000,
  });
}

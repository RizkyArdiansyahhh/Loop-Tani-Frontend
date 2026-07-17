import { useQuery } from "@tanstack/react-query";
import { getStore } from "../api/get-store";
import { sellerKeys } from "../api/query-keys";

export function useStore(slug: string) {
  return useQuery({
    queryKey: sellerKeys.store(slug),
    queryFn: () => getStore(slug),
    enabled: !!slug,
    retry: 1,
  });
}

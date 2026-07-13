import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/get-product-by-id";
import { productKeys } from "../api/query-keys";
import type { QueryConfig } from "@/lib/react-query";

type UseProductByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getProductById>;
};

export function useProductById({ id, queryConfig }: UseProductByIdOptions) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    ...queryConfig,
  });
}

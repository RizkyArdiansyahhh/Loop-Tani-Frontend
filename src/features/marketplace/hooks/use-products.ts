import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/get-products";
import { productKeys } from "../api/query-keys";
import type { GetProductsParams } from "@/types/api";
import type { QueryConfig } from "@/lib/react-query";

type UseProductsOptions = {
  params?: GetProductsParams;
  queryConfig?: QueryConfig<typeof getProducts>;
};

export function useProducts({ params = {}, queryConfig }: UseProductsOptions = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    ...queryConfig,
  });
}

import { useQuery } from "@tanstack/react-query";
import { getFavoriteProducts } from "../api/get-favorite-products";
import { productKeys } from "../api/query-keys";
import type { GetProductsParams } from "@/types/api";
import type { QueryConfig } from "@/lib/react-query";

type UseFavoriteProductsOptions = {
  params?: GetProductsParams;
  queryConfig?: QueryConfig<typeof getFavoriteProducts>;
};

export function useFavoriteProducts({ params = {}, queryConfig }: UseFavoriteProductsOptions = {}) {
  return useQuery({
    // We add "favorites" key to separate it from the public list cache
    queryKey: [...productKeys.lists(), "favorites", params],
    queryFn: () => getFavoriteProducts(params),
    ...queryConfig,
  });
}

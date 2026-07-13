import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/get-categories";
import { categoryKeys } from "../api/query-keys";
import type { QueryConfig } from "@/lib/react-query";

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategories>;
};

export function useCategories({ queryConfig }: UseCategoriesOptions = {}) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 menit — kategori jarang berubah
    ...queryConfig,
  });
}

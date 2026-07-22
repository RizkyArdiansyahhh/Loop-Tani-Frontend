import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../api/get-category-by-id";
import { categoryKeys } from "../api/query-keys";
import type { QueryConfig } from "@/lib/react-query";

type UseCategoryByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getCategoryById>;
};

export function useCategoryById({ id, queryConfig }: UseCategoryByIdOptions) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
    ...queryConfig,
  });
}

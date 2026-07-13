import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/create-product";
import { productKeys } from "../api/query-keys";
import type { CreateProductPayload } from "@/types/api";
import type { MutationConfig } from "@/lib/react-query";

type UseCreateProductOptions = {
  mutationConfig?: MutationConfig<typeof createProduct>;
};

export function useCreateProduct({ mutationConfig }: UseCreateProductOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig ?? {};

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      onSuccess?.(...args);
    },
    ...rest,
  });
}

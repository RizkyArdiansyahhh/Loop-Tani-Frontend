import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../api/update-product";
import { productKeys } from "../api/query-keys";
import type { UpdateProductPayload } from "@/types/api";
import type { MutationConfig } from "@/lib/react-query";

type UpdateProductVariables = {
  id: string;
  payload: UpdateProductPayload;
};

type UseUpdateProductOptions = {
  mutationConfig?: MutationConfig<(vars: UpdateProductVariables) => ReturnType<typeof updateProduct>>;
};

export function useUpdateProduct({ mutationConfig }: UseUpdateProductOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig ?? {};

  return useMutation({
    mutationFn: ({ id, payload }: UpdateProductVariables) =>
      updateProduct(id, payload),
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      onSuccess?.(...args);
    },
    ...rest,
  });
}

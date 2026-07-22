import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../api/delete-product";
import { productKeys } from "../api/query-keys";
import type { MutationConfig } from "@/lib/react-query";

type UseDeleteProductOptions = {
  mutationConfig?: MutationConfig<typeof deleteProduct>;
};

export function useDeleteProduct({ mutationConfig }: UseDeleteProductOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig ?? {};

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (...args) => {
      const [, id] = args;
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      onSuccess?.(...args);
    },
    ...rest,
  });
}

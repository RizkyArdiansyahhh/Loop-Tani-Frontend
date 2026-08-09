import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerOrderStatus, type UpdateSellerOrderStatusPayload } from "../api/update-seller-order-status";
import { sellerKeys } from "../api/query-keys";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: UpdateSellerOrderStatusPayload }) =>
      updateSellerOrderStatus(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.all });
    },
  });
}

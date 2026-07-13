import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCart } from "../api/clear-cart";
import { cartKeys } from "../api/query-keys";
import type { CartResponse } from "@/types/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    // ─── OPTIMISTIC UPDATE FLOW ───
    onMutate: async () => {
      // 1. Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      // 2. Snapshot the previous value
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.all);

      // 3. Optimistically update to the empty state
      if (previousCart) {
        queryClient.setQueryData<CartResponse>(cartKeys.all, {
          ...previousCart,
          items: [],
          summary: {
            totalItems: 0,
            subtotal: 0,
            totalWeight: 0,
          },
        });
      }

      // 4. Return context containing the snapshot
      return { previousCart };
    },

    // ─── ROLLBACK ON FAILURE ───
    onError: (error: AxiosError<{ message?: string }>, __, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.all, context.previousCart);
      }
      const message = error.response?.data?.message || "Gagal mengosongkan keranjang";
      toast.error(message);
    },

    // ─── SYNC ON SETTLED ───
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Keranjang belanja telah dikosongkan");
    },
  });
}

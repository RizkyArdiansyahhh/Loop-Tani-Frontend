import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../api/update-cart-item";
import { cartKeys } from "../api/query-keys";
import type { CartResponse } from "@/types/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UpdateMutationParams {
  id: string;
  quantity: number;
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: UpdateMutationParams) =>
      updateCartItem(id, { quantity }),

    // ─── OPTIMISTIC UPDATE FLOW ───
    onMutate: async ({ id, quantity }) => {
      // 1. Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      // 2. Snapshot the previous value
      const previousCart = queryClient.getQueryData<CartResponse>(cartKeys.all);

      // 3. Optimistically update to the new value
      if (previousCart) {
        const updatedItems = previousCart.items.map((item) => {
          if (item.id === id) {
            const updatedSubtotal = item.product.price * quantity;
            return {
              ...item,
              quantity,
              subtotal: updatedSubtotal,
            };
          }
          return item;
        });

        let totalItems = 0;
        let subtotal = 0;
        let totalWeight = 0;

        updatedItems.forEach((item) => {
          if (item.isAvailable) {
            totalItems += item.quantity;
            subtotal += item.subtotal;
            totalWeight += item.quantity * item.product.weight;
          }
        });

        queryClient.setQueryData<CartResponse>(cartKeys.all, {
          ...previousCart,
          items: updatedItems,
          summary: {
            totalItems,
            subtotal,
            totalWeight,
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
      const message = error.response?.data?.message || "Gagal memperbarui kuantitas";
      toast.error(message);
    },

    // ─── SYNC ON SETTLED ───
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

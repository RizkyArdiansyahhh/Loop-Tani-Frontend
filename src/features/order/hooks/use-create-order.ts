import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import { CreateOrderPayload, CreateOrderResponse } from "../types/order.type";
import { toast } from "sonner";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, Error, CreateOrderPayload>({
    mutationFn: (payload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Gagal membuat pesanan";
      toast.error(message);
    },
  });
}

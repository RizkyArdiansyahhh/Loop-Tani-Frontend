import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api/add-to-cart";
import { cartKeys } from "../api/query-keys";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Invalidate cart queries to refresh badge and detail state
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success("Produk berhasil ditambahkan ke keranjang");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Gagal menambahkan produk ke keranjang";
      toast.error(message);
    },
  });
}

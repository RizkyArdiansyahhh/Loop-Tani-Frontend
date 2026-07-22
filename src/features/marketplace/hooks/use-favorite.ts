import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteProduct } from "../api/favorite-product";
import { unfavoriteProduct } from "../api/unfavorite-product";
import { productKeys } from "../api/query-keys";
import { toast } from "sonner";

export function useFavorite() {
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: favoriteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success("Produk ditambahkan ke favorit");
    },
    onError: () => {
      toast.error("Gagal menambahkan ke favorit");
    },
  });

  const unfavoriteMutation = useMutation({
    mutationFn: unfavoriteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success("Produk dihapus dari favorit");
    },
    onError: () => {
      toast.error("Gagal menghapus dari favorit");
    },
  });

  const toggleFavorite = (id: string, isCurrentlyFavorite: boolean) => {
    if (isCurrentlyFavorite) {
      unfavoriteMutation.mutate(id);
    } else {
      favoriteMutation.mutate(id);
    }
  };

  return {
    toggleFavorite,
    isFavoriting: favoriteMutation.isPending,
    isUnfavoriting: unfavoriteMutation.isPending,
  };
}

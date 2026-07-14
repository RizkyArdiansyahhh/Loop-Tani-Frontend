import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimReward } from "../api/claim-reward";
import { panduanKeys } from "../api/query-keys";
import { toast } from "sonner";

export function useClaimReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimReward,
    onSuccess: (data, contentId) => {
      // Invalidate points cache
      queryClient.invalidateQueries({ queryKey: panduanKeys.points() });
      queryClient.invalidateQueries({ queryKey: panduanKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: panduanKeys.progress(contentId) });
      queryClient.invalidateQueries({ queryKey: panduanKeys.content(contentId) });

      toast.success("Klaim LoopPoints Berhasil!", {
        description: `Selamat! Anda mendapatkan +${data.pointsEarned} LoopPoints. Saldo baru Anda: ${data.totalPoints} LP (Tier: ${data.tier}).`,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal mengklaim LoopPoints.";
      toast.error(message);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulateApprove } from "../api/simulate-approve";
import { sellerKeys } from "../api/query-keys";
import { profileKeys } from "@/features/profile/api/query-keys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSimulateApprove() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: simulateApprove,
    onSuccess: (data) => {
      queryClient.setQueryData(sellerKeys.me(), data);
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      queryClient.invalidateQueries({ queryKey: sellerKeys.dashboard() });
      toast.success(`Status toko berhasil diubah menjadi ${data.status}`);
      router.refresh();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal mengubah status toko";
      toast.error(message);
    },
  });
}

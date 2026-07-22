import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerSeller } from "../api/register-seller";
import { sellerKeys } from "../api/query-keys";
import { profileKeys } from "@/features/profile/api/query-keys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useRegisterSeller() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: registerSeller,
    onSuccess: (data) => {
      queryClient.setQueryData(sellerKeys.me(), data);
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      toast.success("Berhasil mendaftar! Menunggu persetujuan.");
      router.push("/seller");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal mendaftar sebagai seller";
      toast.error(message);
    },
  });
}

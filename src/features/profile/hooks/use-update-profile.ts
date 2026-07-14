import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/update-profile";
import { profileKeys } from "../api/query-keys";
import { toast } from "sonner";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.detail(), data);
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal memperbarui profil";
      toast.error(message);
    },
  });
}

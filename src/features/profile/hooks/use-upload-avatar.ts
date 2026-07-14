import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "../api/upload-avatar";
import { profileKeys } from "../api/query-keys";
import { toast } from "sonner";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.detail(), data);
      toast.success("Foto profil berhasil diperbarui!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal mengunggah foto profil";
      toast.error(message);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress, addressKeys } from "../api/address.api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const t = useTranslations("address.page");

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(t("successDelete"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal menghapus alamat";
      toast.error(message);
    },
  });
}

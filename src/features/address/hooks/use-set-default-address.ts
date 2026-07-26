import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultAddress, addressKeys } from "../api/address.api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  const t = useTranslations("address.page");

  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(t("successSetDefault"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal mengubah alamat utama";
      toast.error(message);
    },
  });
}

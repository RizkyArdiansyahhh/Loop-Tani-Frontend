import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress, addressKeys } from "../api/address.api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const t = useTranslations("address.page");

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(t("successCreate"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal menambahkan alamat";
      toast.error(message);
    },
  });
}

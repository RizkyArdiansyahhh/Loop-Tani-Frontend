import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress, addressKeys } from "../api/address.api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { UpdateAddressPayload } from "../types/address.type";

interface UpdateAddressParams {
  id: string;
  payload: UpdateAddressPayload;
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const t = useTranslations("address.page");

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAddressParams) => updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(t("successUpdate"));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Gagal memperbarui alamat";
      toast.error(message);
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerSettings } from "../api/update-seller-settings";
import type { UpdateSellerSettingsPayload } from "../types";
import { sellerKeys } from "../api/query-keys";
import type { MutationConfig } from "@/lib/react-query";

type UseUpdateSellerSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateSellerSettings>;
};

export function useUpdateSellerSettings({ mutationConfig }: UseUpdateSellerSettingsOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = mutationConfig ?? {};

  return useMutation({
    mutationFn: (payload: UpdateSellerSettingsPayload) => updateSellerSettings(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.me() });
      queryClient.invalidateQueries({ queryKey: sellerKeys.dashboard() });
      onSuccess?.(...args);
    },
    ...rest,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestPayout, type RequestPayoutPayload } from "../api/request-payout";
import { sellerKeys } from "../api/query-keys";

export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestPayoutPayload) => requestPayout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.all });
    },
  });
}

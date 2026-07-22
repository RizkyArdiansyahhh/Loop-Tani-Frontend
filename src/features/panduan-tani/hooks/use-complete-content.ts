import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeContent } from "../api/complete-content";
import { panduanKeys } from "../api/query-keys";

export function useCompleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeContent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: panduanKeys.progress(variables.contentId) });
      queryClient.invalidateQueries({ queryKey: panduanKeys.content(variables.contentId) });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContent } from "../api/create-content";
import { panduanKeys } from "../api/query-keys";

export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: panduanKeys.contents() });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { getProgress } from "../api/get-progress";
import { panduanKeys } from "../api/query-keys";

export function useProgress(contentId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: panduanKeys.progress(contentId),
    queryFn: () => getProgress(contentId),
    enabled: !!contentId && enabled,
  });
}

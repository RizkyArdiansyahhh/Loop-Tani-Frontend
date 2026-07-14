import { useQuery } from "@tanstack/react-query";
import { getContent } from "../api/get-content";
import { panduanKeys } from "../api/query-keys";

export function useContent(idOrSlug: string) {
  return useQuery({
    queryKey: panduanKeys.content(idOrSlug),
    queryFn: () => getContent(idOrSlug),
    enabled: !!idOrSlug,
  });
}

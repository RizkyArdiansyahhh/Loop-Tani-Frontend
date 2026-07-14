import { useQuery } from "@tanstack/react-query";
import { getContents, GetContentsParams } from "../api/get-contents";
import { panduanKeys } from "../api/query-keys";

export function useContents(params?: GetContentsParams) {
  return useQuery({
    queryKey: panduanKeys.contents(params),
    queryFn: () => getContents(params),
  });
}

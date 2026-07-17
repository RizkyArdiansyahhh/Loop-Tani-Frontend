import { useQuery } from "@tanstack/react-query";
import { getComments, GetCommentsParams } from "../api/comments";
import { panduanKeys } from "../api/query-keys";

export function useComments(contentId: string, params?: GetCommentsParams) {
  return useQuery({
    queryKey: panduanKeys.comments(contentId, params?.page),
    queryFn: () => getComments(contentId, params),
    enabled: !!contentId,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replySellerReview, type ReplySellerReviewPayload } from "../api/reply-seller-review";
import { sellerKeys } from "../api/query-keys";

export function useReplySellerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: ReplySellerReviewPayload }) =>
      replySellerReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.all });
    },
  });
}

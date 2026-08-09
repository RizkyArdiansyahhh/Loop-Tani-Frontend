import { axiosInstance } from "@/lib/axios";

export interface ReplySellerReviewPayload {
  reply: string;
}

export async function replySellerReview(reviewId: string, payload: ReplySellerReviewPayload) {
  const { data } = await axiosInstance.post(`/seller/reviews/${reviewId}/reply`, payload);
  return data;
}

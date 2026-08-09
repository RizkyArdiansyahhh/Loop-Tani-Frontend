import { axiosInstance } from "@/lib/axios";

export interface SellerReview {
  id: string;
  orderId: string;
  orderNumber: string;
  buyerName: string;
  buyerAvatar?: string | null;
  rating: number;
  comment: string;
  productTitle: string;
  productThumbnail?: string | null;
  createdAt: string;
  sellerReply?: {
    content: string;
    createdAt: string;
  } | null;
}

export interface SellerReviewsSummary {
  averageRating: number;
  totalReviews: number;
  satisfactionRate: string;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface SellerReviewsResponse {
  summary: SellerReviewsSummary;
  reviews: SellerReview[];
}

export async function getSellerReviews(rating?: number): Promise<SellerReviewsResponse> {
  const { data } = await axiosInstance.get<SellerReviewsResponse>("/seller/reviews", {
    params: { rating },
  });
  return data;
}

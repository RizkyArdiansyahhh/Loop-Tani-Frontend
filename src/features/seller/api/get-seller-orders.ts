import { axiosInstance } from "@/lib/axios";

export interface SellerOrderItem {
  id: string;
  productId: string;
  productName: string;
  thumbnailUrl?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  unit?: string;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone?: string;
  shippingAddress: string;
  items: SellerOrderItem[];
  grandTotal: number;
  subtotal: number;
  shippingCost: number;
  serviceFee: number;
  discount: number;
  orderStatus: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED" | "EXPIRED";
  paymentStatus: "PENDING" | "SUCCEEDED" | "FAILED" | "EXPIRED" | "CANCELLED";
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrdersResponse {
  data: SellerOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetSellerOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export async function getSellerOrders(params?: GetSellerOrdersParams): Promise<SellerOrdersResponse> {
  const { data } = await axiosInstance.get<SellerOrdersResponse>("/seller/orders", {
    params,
  });
  return data;
}

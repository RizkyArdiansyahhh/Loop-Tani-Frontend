import { axiosInstance } from "@/lib/axios";

export interface UpdateSellerOrderStatusPayload {
  status: string;
}

export async function updateSellerOrderStatus(orderId: string, payload: UpdateSellerOrderStatusPayload) {
  const { data } = await axiosInstance.patch(`/seller/orders/${orderId}/status`, payload);
  return data;
}

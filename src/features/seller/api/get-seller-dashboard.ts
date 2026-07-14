import { axiosInstance } from "@/lib/axios";
import type { SellerDashboardResponse } from "@/types/api";

export async function getSellerDashboard(): Promise<SellerDashboardResponse> {
  const { data } = await axiosInstance.get<SellerDashboardResponse>("/seller/dashboard");
  return data;
}

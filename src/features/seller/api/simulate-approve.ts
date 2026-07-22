import { axiosInstance } from "@/lib/axios";
import type { SimulateApprovePayload, UserSellerProfile } from "@/types/api";

export async function simulateApprove(payload: SimulateApprovePayload): Promise<UserSellerProfile> {
  const { data } = await axiosInstance.post<UserSellerProfile>("/seller/simulate-approve", payload);
  return data;
}

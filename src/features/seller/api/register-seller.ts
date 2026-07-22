import { axiosInstance } from "@/lib/axios";
import type { RegisterSellerPayload, UserSellerProfile } from "@/types/api";

export async function registerSeller(payload: RegisterSellerPayload): Promise<UserSellerProfile> {
  const { data } = await axiosInstance.post<UserSellerProfile>("/seller/register", payload);
  return data;
}
import { axiosInstance } from "@/lib/axios";
import type { UserSellerProfile } from "@/types/api";

export async function getSellerMe(): Promise<UserSellerProfile> {
  const { data } = await axiosInstance.get<UserSellerProfile>("/seller/me");
  return data;
}

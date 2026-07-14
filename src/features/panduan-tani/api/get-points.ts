import { axiosInstance } from "@/lib/axios";
import type { UserPointAccount } from "@/types/api";

export async function getPointAccount(): Promise<UserPointAccount> {
  const { data } = await axiosInstance.get<UserPointAccount>("/points/me");
  return data;
}

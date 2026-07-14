import { axiosInstance } from "@/lib/axios";
import type { UserProfile } from "@/types/api";

export async function getProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get<UserProfile>("/profile");
  return data;
}

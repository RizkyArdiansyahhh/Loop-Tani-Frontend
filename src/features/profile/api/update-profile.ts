import { axiosInstance } from "@/lib/axios";
import type { UpdateProfilePayload, UserProfile } from "@/types/api";

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const { data } = await axiosInstance.patch<UserProfile>("/profile", payload);
  return data;
}

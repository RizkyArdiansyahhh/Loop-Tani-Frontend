import { axiosInstance } from "@/lib/axios";
import type { UserProfile } from "@/types/api";

export async function uploadAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post<UserProfile>("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

import { axiosInstance } from "@/lib/axios";

export interface UserNotification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export async function getNotifications(): Promise<UserNotification[]> {
  const { data } = await axiosInstance.get<UserNotification[]>("/profile/notifications");
  return data;
}

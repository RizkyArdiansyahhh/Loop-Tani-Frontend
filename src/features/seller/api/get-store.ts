import { axiosInstance } from "@/lib/axios";
import type { PublicStoreProfile } from "@/types/api";

export async function getStore(slug: string): Promise<PublicStoreProfile> {
  const { data } = await axiosInstance.get<PublicStoreProfile>(`/seller/store/${slug}`);
  return data;
}

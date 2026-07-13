import { axiosInstance } from "@/lib/axios";
import type { CartResponse } from "@/types/api";

export async function getCart(): Promise<CartResponse> {
  const { data } = await axiosInstance.get<CartResponse>("/cart");
  return data;
}

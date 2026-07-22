import { axiosInstance } from "@/lib/axios";
import type { AddToCartPayload } from "@/types/api";

export async function addToCart(payload: AddToCartPayload): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<{ message: string }>("/cart", payload);
  return data;
}

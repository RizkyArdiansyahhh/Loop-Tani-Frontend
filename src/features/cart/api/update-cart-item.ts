import { axiosInstance } from "@/lib/axios";
import type { UpdateCartItemPayload } from "@/types/api";

export async function updateCartItem(
  id: string,
  payload: UpdateCartItemPayload
): Promise<{ message: string }> {
  const { data } = await axiosInstance.patch<{ message: string }>(
    `/cart/items/${id}`,
    payload
  );
  return data;
}

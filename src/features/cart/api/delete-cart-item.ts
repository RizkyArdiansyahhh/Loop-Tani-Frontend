import { axiosInstance } from "@/lib/axios";

export async function deleteCartItem(id: string): Promise<{ message: string }> {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/cart/items/${id}`
  );
  return data;
}

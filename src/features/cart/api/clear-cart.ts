import { axiosInstance } from "@/lib/axios";

export async function clearCart(): Promise<{ message: string }> {
  const { data } = await axiosInstance.delete<{ message: string }>("/cart");
  return data;
}

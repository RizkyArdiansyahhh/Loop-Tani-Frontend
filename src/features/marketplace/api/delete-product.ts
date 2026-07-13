import { axiosInstance } from "@/lib/axios";

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const { data } = await axiosInstance.delete<{ message: string }>(`/products/${id}`);
  return data;
}

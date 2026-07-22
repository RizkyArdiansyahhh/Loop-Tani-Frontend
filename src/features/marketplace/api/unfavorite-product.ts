import { axiosInstance } from "@/lib/axios";

export async function unfavoriteProduct(id: string): Promise<{ message: string }> {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/products/${id}/favorite`
  );
  return data;
}

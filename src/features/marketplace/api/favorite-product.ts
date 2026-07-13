import { axiosInstance } from "@/lib/axios";

export async function favoriteProduct(id: string): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<{ message: string }>(
    `/products/${id}/favorite`
  );
  return data;
}

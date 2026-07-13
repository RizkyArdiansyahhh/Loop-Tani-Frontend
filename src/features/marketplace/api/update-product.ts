import { axiosInstance } from "@/lib/axios";
import type { UpdateProductPayload, Product } from "@/types/api";

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const { data } = await axiosInstance.patch<Product>(`/products/${id}`, payload);
  return data;
}

import { axiosInstance } from "@/lib/axios";
import type { Product } from "@/types/api";

export async function getProductById(id: string): Promise<Product> {
  const { data } = await axiosInstance.get<Product>(`/products/${id}`);
  return data;
}

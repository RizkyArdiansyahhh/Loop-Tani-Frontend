import { axiosInstance } from "@/lib/axios";
import type { CreateProductPayload, Product } from "@/types/api";

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await axiosInstance.post<Product>("/products", payload);
  return data;
}

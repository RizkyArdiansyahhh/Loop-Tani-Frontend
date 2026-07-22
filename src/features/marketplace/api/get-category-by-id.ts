import { axiosInstance } from "@/lib/axios";
import type { Category } from "@/types/api";

export async function getCategoryById(id: string): Promise<Category> {
  const { data } = await axiosInstance.get<Category>(`/categories/${id}`);
  return data;
}

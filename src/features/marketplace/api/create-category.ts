import { axiosInstance } from "@/lib/axios";
import type { Category, CreateCategoryPayload } from "@/types/api";

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const { data } = await axiosInstance.post<Category>("/categories", payload);
  return data;
}

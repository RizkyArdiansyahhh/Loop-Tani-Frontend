import { axiosInstance } from "@/lib/axios";
import type { CategoryWithCount } from "@/types/api";

export async function getCategories(): Promise<CategoryWithCount[]> {
  const { data } = await axiosInstance.get<CategoryWithCount[]>("/categories");
  return data;
}

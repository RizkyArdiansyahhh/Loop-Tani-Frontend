import { axiosInstance } from "@/lib/axios";
import type { KnowledgeContent } from "@/types/api";

export async function getContent(idOrSlug: string): Promise<KnowledgeContent> {
  const { data } = await axiosInstance.get<KnowledgeContent>(`/knowledge/${idOrSlug}`);
  return data;
}

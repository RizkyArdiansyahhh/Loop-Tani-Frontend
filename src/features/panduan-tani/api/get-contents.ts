import { axiosInstance } from "@/lib/axios";
import type { KnowledgeContent, PaginatedResponse } from "@/types/api";

export interface GetContentsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'ARTICLE' | 'VIDEO';
  category?: string;
  difficulty?: string;
}

export async function getContents(params?: GetContentsParams): Promise<PaginatedResponse<KnowledgeContent>> {
  const { data } = await axiosInstance.get<PaginatedResponse<KnowledgeContent>>("/knowledge", { params });
  return data;
}

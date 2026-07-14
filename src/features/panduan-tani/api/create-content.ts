import { axiosInstance } from "@/lib/axios";
import type { KnowledgeContent, CreateProductPayload } from "@/types/api"; // Reuse standard payload type patterns

export interface CreateContentPayload {
  type: 'ARTICLE' | 'VIDEO';
  title: string;
  content: string;
  category: 'limbah' | 'olahan' | 'alat';
  difficulty: 'pemula' | 'menengah';
  imageUrl?: string;
  estimatedReadingMinutes?: number;
  videoDuration?: number;
  cloudinaryPublicId?: string;
  secureUrl?: string;
  thumbnailUrl?: string;
}

export async function createContent(payload: CreateContentPayload): Promise<KnowledgeContent> {
  const { data } = await axiosInstance.post<KnowledgeContent>("/knowledge", payload);
  return data;
}

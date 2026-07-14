import { axiosInstance } from "@/lib/axios";
import type { LearningProgress } from "@/types/api";

export async function getProgress(contentId: string): Promise<LearningProgress> {
  const { data } = await axiosInstance.get<LearningProgress>(`/knowledge/${contentId}/progress`);
  return data;
}

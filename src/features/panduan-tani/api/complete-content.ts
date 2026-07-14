import { axiosInstance } from "@/lib/axios";
import type { CompleteContentPayload, CompleteContentResponse } from "@/types/api";

export interface CompleteContentParams {
  contentId: string;
  payload: CompleteContentPayload;
}

export async function completeContent({ contentId, payload }: CompleteContentParams): Promise<CompleteContentResponse> {
  const { data } = await axiosInstance.post<CompleteContentResponse>(`/knowledge/${contentId}/complete`, payload);
  return data;
}

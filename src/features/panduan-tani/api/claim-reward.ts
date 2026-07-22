import { axiosInstance } from "@/lib/axios";
import type { ClaimRewardResponse } from "@/types/api";

export async function claimReward(contentId: string): Promise<ClaimRewardResponse> {
  const { data } = await axiosInstance.post<ClaimRewardResponse>(`/knowledge/${contentId}/claim`);
  return data;
}

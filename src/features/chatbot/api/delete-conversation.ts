import { axiosInstance } from "@/lib/axios";

export interface DeleteConversationResponse {
  success: boolean;
  message: string;
}

export async function deleteConversation(
  conversationId: string
): Promise<DeleteConversationResponse> {
  const { data } = await axiosInstance.delete<DeleteConversationResponse>(
    `/chat/conversations/${conversationId}`
  );
  return data;
}

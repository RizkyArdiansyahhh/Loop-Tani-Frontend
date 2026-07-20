import { axiosInstance } from "@/lib/axios";
import type { ChatMessageItem } from "./send-message";

export interface ConversationDetail {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageItem[];
}

export async function getConversationDetail(
  conversationId: string
): Promise<ConversationDetail> {
  const { data } = await axiosInstance.get<ConversationDetail>(
    `/chat/conversations/${conversationId}`
  );
  return data;
}

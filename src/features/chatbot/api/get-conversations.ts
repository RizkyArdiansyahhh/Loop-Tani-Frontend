import { axiosInstance } from "@/lib/axios";

export interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
  lastMessage: string;
}

export async function getConversations(): Promise<ConversationSummary[]> {
  const { data } = await axiosInstance.get<ConversationSummary[]>(
    "/chat/conversations"
  );
  return data;
}

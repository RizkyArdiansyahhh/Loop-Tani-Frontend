import { axiosInstance } from "@/lib/axios";

export interface SendMessagePayload {
  message: string;
  conversationId?: string | null;
}

export interface ChatMessageItem {
  id?: string;
  role: "user" | "model";
  content: string;
  createdAt?: string;
}

export interface SendMessageResponse {
  conversationId: string | null;
  message?: string;
  userMessage?: ChatMessageItem;
  assistantMessage?: ChatMessageItem;
}

export async function sendMessage(
  payload: SendMessagePayload
): Promise<SendMessageResponse> {
  const { data } = await axiosInstance.post<SendMessageResponse>(
    "/chat/message",
    payload
  );
  return data;
}

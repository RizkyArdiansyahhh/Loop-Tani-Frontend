import { axiosInstance } from "@/lib/axios";

export interface SendMessagePayload {
  message: string;
}

export interface SendMessageResponse {
  message: string;
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

import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../api/send-message";

export function useChatbot() {
  return useMutation({
    mutationFn: sendMessage,
  });
}

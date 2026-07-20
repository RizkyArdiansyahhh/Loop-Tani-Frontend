import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, type SendMessageResponse } from "../api/send-message";
import { chatbotKeys } from "../api/query-keys";

export function useChatbot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data: SendMessageResponse) => {
      if (data.conversationId) {
        queryClient.invalidateQueries({ queryKey: chatbotKeys.conversations() });
        queryClient.invalidateQueries({
          queryKey: chatbotKeys.detail(data.conversationId),
        });
      }
    },
  });
}

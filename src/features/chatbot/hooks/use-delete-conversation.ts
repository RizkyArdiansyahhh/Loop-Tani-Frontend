import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "../api/delete-conversation";
import { chatbotKeys } from "../api/query-keys";

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: chatbotKeys.conversations() });
      queryClient.removeQueries({ queryKey: chatbotKeys.detail(conversationId) });
    },
  });
}

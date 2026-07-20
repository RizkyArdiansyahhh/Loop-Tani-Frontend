import { useQuery } from "@tanstack/react-query";
import { getConversationDetail } from "../api/get-conversation-detail";
import { chatbotKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useConversationDetail(conversationId: string | null) {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  return useQuery({
    queryKey: chatbotKeys.detail(conversationId),
    queryFn: () => getConversationDetail(conversationId!),
    enabled: isLoggedIn && !!conversationId,
  });
}

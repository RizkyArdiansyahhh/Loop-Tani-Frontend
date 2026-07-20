import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../api/get-conversations";
import { chatbotKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useConversations() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  return useQuery({
    queryKey: chatbotKeys.conversations(),
    queryFn: getConversations,
    enabled: isLoggedIn,
  });
}

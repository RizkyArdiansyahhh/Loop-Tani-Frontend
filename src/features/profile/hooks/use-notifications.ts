import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/get-notifications";
import { authClient } from "@/lib/auth-client";

export function useNotifications() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ["profile", "notifications"],
    queryFn: getNotifications,
    enabled: !!session,
  });
}

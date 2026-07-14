import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/get-profile";
import { profileKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";

export function useProfile() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
    enabled: !!session,
  });
}

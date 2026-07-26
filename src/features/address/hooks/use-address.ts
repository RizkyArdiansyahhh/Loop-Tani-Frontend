import { useQuery } from "@tanstack/react-query";
import { getAddresses, getAddress, addressKeys } from "../api/address.api";
import { authClient } from "@/lib/auth-client";

export function useAddresses() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: getAddresses,
    enabled: !!session,
  });
}

export function useAddressDetail(id: string) {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => getAddress(id),
    enabled: !!session && !!id,
  });
}

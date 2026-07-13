import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/get-cart";
import { cartKeys } from "../api/query-keys";
import { authClient } from "@/lib/auth-client";
import type { QueryConfig } from "@/lib/react-query";

type UseCartOptions = {
  queryConfig?: QueryConfig<typeof getCart>;
};

export function useCart({ queryConfig }: UseCartOptions = {}) {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  return useQuery({
    queryKey: cartKeys.all,
    queryFn: getCart,
    enabled: isLoggedIn,
    ...queryConfig,
  });
}

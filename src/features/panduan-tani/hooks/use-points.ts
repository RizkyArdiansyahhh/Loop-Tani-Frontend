import { useQuery } from "@tanstack/react-query";
import { getPointAccount } from "../api/get-points";
import { panduanKeys } from "../api/query-keys";

export function usePoints(enabled: boolean = true) {
  return useQuery({
    queryKey: panduanKeys.points(),
    queryFn: getPointAccount,
    enabled,
  });
}

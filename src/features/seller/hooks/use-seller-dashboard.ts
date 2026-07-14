import { useQuery } from "@tanstack/react-query";
import { getSellerDashboard } from "../api/get-seller-dashboard";
import { sellerKeys } from "../api/query-keys";
import { useSellerMe } from "./use-seller-me";

export function useSellerDashboard() {
  const { data: sellerMe } = useSellerMe();

  return useQuery({
    queryKey: sellerKeys.dashboard(),
    queryFn: getSellerDashboard,
    enabled: sellerMe?.status === "ACTIVE",
  });
}

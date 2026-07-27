import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import { GetOrdersParams, OrderPaginatedResponse } from "../types/order.type";

export function useOrders(params?: GetOrdersParams) {
  return useQuery<OrderPaginatedResponse>({
    queryKey: ["orders", params?.status, params?.page, params?.limit],
    queryFn: () => orderService.getOrders(params),
  });
}

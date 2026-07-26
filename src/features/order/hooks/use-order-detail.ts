import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import { Order } from "../types/order.type";

export function useOrderDetail(orderId: string) {
  return useQuery<Order>({
    queryKey: ["orders", orderId],
    queryFn: () => orderService.getOrderDetail(orderId),
    enabled: Boolean(orderId),
  });
}

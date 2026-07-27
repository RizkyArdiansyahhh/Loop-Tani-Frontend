import { axiosInstance } from "@/lib/axios";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  OrderPaginatedResponse,
  GetOrdersParams,
} from "../types/order.type";

export const orderService = {
  /**
   * Create Order (Unified endpoint for BUY_NOW & CART)
   */
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await axiosInstance.post<CreateOrderResponse>("/orders", payload);
    return data;
  },

  /**
   * Get User Orders list (Paginated with status filter)
   */
  async getOrders(params?: GetOrdersParams): Promise<OrderPaginatedResponse> {
    const { data } = await axiosInstance.get<OrderPaginatedResponse>("/orders", {
      params,
    });
    return data;
  },

  /**
   * Get Single Order Detail by ID
   */
  async getOrderDetail(id: string): Promise<Order> {
    const { data } = await axiosInstance.get<Order>(`/orders/${id}`);
    return data;
  },
};

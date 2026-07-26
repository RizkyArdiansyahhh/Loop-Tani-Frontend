import { axiosInstance } from "@/lib/axios";
import {
  BuyNowCheckoutPayload,
  CartCheckoutPayload,
  CheckoutResponse,
} from "../types/checkout.type";

export const checkoutService = {
  buyNowCheckout: async (payload: BuyNowCheckoutPayload): Promise<CheckoutResponse> => {
    const response = await axiosInstance.post<CheckoutResponse>("/checkout/buy-now", payload);
    return response.data;
  },

  cartCheckout: async (payload: CartCheckoutPayload): Promise<CheckoutResponse> => {
    const response = await axiosInstance.post<CheckoutResponse>("/checkout/cart", payload);
    return response.data;
  },
};

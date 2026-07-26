import { useMutation } from "@tanstack/react-query";
import { checkoutService } from "../services/checkout.service";
import { CartCheckoutPayload, CheckoutResponse } from "../types/checkout.type";
import { useCheckoutStore } from "../store/checkout.store";

export function useCartCheckout() {
  const setCheckoutResponse = useCheckoutStore((state) => state.setCheckoutResponse);

  return useMutation<CheckoutResponse, Error, CartCheckoutPayload>({
    mutationFn: (payload: CartCheckoutPayload) => checkoutService.cartCheckout(payload),
    onSuccess: (data) => {
      setCheckoutResponse(data);
    },
  });
}

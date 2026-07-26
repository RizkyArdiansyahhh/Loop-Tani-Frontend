import { useMutation } from "@tanstack/react-query";
import { checkoutService } from "../services/checkout.service";
import { BuyNowCheckoutPayload, CheckoutResponse } from "../types/checkout.type";
import { useCheckoutStore } from "../store/checkout.store";

export function useBuyNowCheckout() {
  const setCheckoutResponse = useCheckoutStore((state) => state.setCheckoutResponse);

  return useMutation<CheckoutResponse, Error, BuyNowCheckoutPayload>({
    mutationFn: (payload: BuyNowCheckoutPayload) => checkoutService.buyNowCheckout(payload),
    onSuccess: (data) => {
      setCheckoutResponse(data);
    },
  });
}

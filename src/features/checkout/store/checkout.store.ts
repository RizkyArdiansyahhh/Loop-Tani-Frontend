import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  BuyNowCheckoutPayload,
  CartCheckoutPayload,
  CheckoutResponse,
} from "../types/checkout.type";

export type CheckoutType = "BUY_NOW" | "CART" | null;

interface CheckoutState {
  checkoutType: CheckoutType;
  buyNowPayload: BuyNowCheckoutPayload | null;
  cartPayload: CartCheckoutPayload | null;
  selectedAddressId: string | null;
  checkoutResponse: CheckoutResponse | null;

  setBuyNowCheckout: (payload: BuyNowCheckoutPayload) => void;
  setCartCheckout: (payload: CartCheckoutPayload) => void;
  setSelectedAddressId: (addressId: string) => void;
  setCheckoutResponse: (response: CheckoutResponse | null) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      checkoutType: null,
      buyNowPayload: null,
      cartPayload: null,
      selectedAddressId: null,
      checkoutResponse: null,

      setBuyNowCheckout: (payload) =>
        set({
          checkoutType: "BUY_NOW",
          buyNowPayload: payload,
          cartPayload: null,
          selectedAddressId: payload.addressId || null,
        }),

      setCartCheckout: (payload) =>
        set({
          checkoutType: "CART",
          cartPayload: payload,
          buyNowPayload: null,
          selectedAddressId: payload.addressId || null,
        }),

      setSelectedAddressId: (addressId) =>
        set({
          selectedAddressId: addressId,
        }),

      setCheckoutResponse: (response) =>
        set({
          checkoutResponse: response,
        }),

      clearCheckout: () =>
        set({
          checkoutType: null,
          buyNowPayload: null,
          cartPayload: null,
          selectedAddressId: null,
          checkoutResponse: null,
        }),
    }),
    {
      name: "loop-tani-checkout-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

import { Suspense } from "react";
import { CheckoutPage } from "@/features/checkout/pages/checkout-page";
import { CheckoutSkeleton } from "@/features/checkout/components/checkout-skeleton";

export const metadata = {
  title: "Checkout - Loop Tani",
  description: "Pengiriman dan ringkasan pembayaran belanja di Loop Tani",
};

export default function Page() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPage />
    </Suspense>
  );
}

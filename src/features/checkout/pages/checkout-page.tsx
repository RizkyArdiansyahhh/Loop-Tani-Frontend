"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useCheckoutStore } from "../store/checkout.store";
import { useBuyNowCheckout } from "../hooks/use-buy-now-checkout";
import { useCartCheckout } from "../hooks/use-cart-checkout";
import { CheckoutAddressCard } from "../components/checkout-address-card";
import { AddressSelectionDialog } from "../components/address-selection-dialog";
import { CheckoutStoreCard } from "../components/checkout-store-card";
import { CheckoutSummary } from "../components/checkout-summary";
import { CheckoutFooter } from "../components/checkout-footer";
import { CheckoutSkeleton } from "../components/checkout-skeleton";
import { EmptyCheckout, EmptyCheckoutReason } from "../components/empty-checkout";
import { PaymentModal } from "@/features/payment/components/payment-modal";
import { toast } from "sonner";

import { useCreateOrder } from "@/features/order/hooks/use-create-order";

export function CheckoutPage() {
  const t = useTranslations("checkout.page");
  const router = useRouter();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [createdPaymentInfo, setCreatedPaymentInfo] = useState<{
    orderId: string;
    paymentId: string;
    amount: number;
    orderNumber: string;
  } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Zustand Store
  const {
    checkoutType,
    buyNowPayload,
    cartPayload,
    selectedAddressId,
    checkoutResponse,
    selectedShippingByStore,
    setSelectedAddressId,
    clearCheckout,
  } = useCheckoutStore();

  // Mutations
  const buyNowMutation = useBuyNowCheckout();
  const cartMutation = useCartCheckout();
  const createOrderMutation = useCreateOrder();

  const isLoading =
    buyNowMutation.isPending ||
    cartMutation.isPending ||
    createOrderMutation.isPending;

  // Auto Fetch preview data whenever payload or selectedAddressId changes
  useEffect(() => {
    if (checkoutType === "BUY_NOW" && buyNowPayload) {
      buyNowMutation.mutate({
        ...buyNowPayload,
        addressId: selectedAddressId || undefined,
      });
    } else if (checkoutType === "CART" && cartPayload) {
      cartMutation.mutate({
        ...cartPayload,
        addressId: selectedAddressId || undefined,
      });
    }
  }, [checkoutType, selectedAddressId]);

  // Handle changing address from modal
  const handleSelectAddress = (newAddressId: string) => {
    setSelectedAddressId(newAddressId);
  };

  // Callback handler for Place Order ("Bayar Sekarang")
  const handlePlaceOrder = () => {
    if (!checkoutResponse?.address) {
      toast.error("Silakan atur alamat pengiriman Anda terlebih dahulu");
      return;
    }

    if (checkoutType === "BUY_NOW" && buyNowPayload) {
      createOrderMutation.mutate(
        {
          checkoutType: "BUY_NOW",
          addressId: checkoutResponse.address.id,
          productId: buyNowPayload.productId,
          quantity: buyNowPayload.quantity,
        },
        {
          onSuccess: (res) => {
            clearCheckout();
            toast.success("Pesanan berhasil dibuat!");
            const targetOrderId = res.orders[0]?.id;
            if (targetOrderId) {
              router.push(`/profile/orders/${targetOrderId}`);
            } else {
              router.push("/profile/orders");
            }
          },
        },
      );
    } else if (checkoutType === "CART" && cartPayload) {
      createOrderMutation.mutate(
        {
          checkoutType: "CART",
          addressId: checkoutResponse.address.id,
          cartItemIds: cartPayload.cartItemIds,
        },
        {
          onSuccess: (res) => {
            clearCheckout();
            toast.success(`${res.totalOrders} Pesanan berhasil dibuat!`);
            if (res.totalOrders === 1 && res.orders[0]?.id) {
              router.push(`/profile/orders/${res.orders[0].id}`);
            } else {
              router.push("/profile/orders");
            }
          },
        },
      );
    }
  };

  // Determine error/empty reason
  const isError = buyNowMutation.isError || cartMutation.isError;
  const errorMessage =
    (buyNowMutation.error as any)?.response?.data?.message ||
    (cartMutation.error as any)?.response?.data?.message ||
    buyNowMutation.error?.message ||
    cartMutation.error?.message;

  // Render Skeleton on initial loading if no response yet
  if (isLoading && !checkoutResponse) {
    return <CheckoutSkeleton />;
  }

  // Render Empty State if no checkout payload in store
  if (!checkoutType || (!buyNowPayload && !cartPayload)) {
    return <EmptyCheckout reason="EMPTY_CART" />;
  }

  // Render Error UI if backend returned failure
  if (isError && !checkoutResponse) {
    let reason: EmptyCheckoutReason = "ERROR";
    if (
      errorMessage?.toLowerCase().includes("stok") ||
      errorMessage?.toLowerCase().includes("stok tidak mencukupi")
    ) {
      reason = "OUT_OF_STOCK";
    }
    return <EmptyCheckout reason={reason} errorMessage={errorMessage} />;
  }

  const address = checkoutResponse?.address || null;
  const stores = checkoutResponse?.stores || [];
  const pricing = checkoutResponse?.pricing || {
    subtotal: 0,
    shippingCost: 0,
    serviceFee: 0,
    discount: 0,
    insuranceFee: 0,
    applicationFee: 0,
    total: 0,
  };

  const totalShippingCost = useMemo(() => {
    return Object.values(selectedShippingByStore).reduce(
      (sum, item) => sum + (item?.cost || 0),
      0
    );
  }, [selectedShippingByStore]);

  const computedPricing = useMemo(() => {
    const subtotal = pricing.subtotal;
    const shippingCost = totalShippingCost;
    const serviceFee = pricing.serviceFee || 0;
    const discount = pricing.discount || 0;
    const total = Math.max(0, subtotal + shippingCost + serviceFee - discount);

    return {
      ...pricing,
      shippingCost,
      total,
    };
  }, [pricing, totalShippingCost]);

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-gray-950 font-sans pb-28 md:pb-16">
      {/* Clean Top Header Bar */}
      <div className="bg-card border-b border-border/60 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href={checkoutType === "CART" ? "/cart" : "/marketplace"}
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            ← {checkoutType === "CART" ? t("backToCart") : t("backToMarketplace")}
          </Link>

          <h1 className="text-base font-bold text-foreground font-poppins">{t("title")}</h1>

          <span className="hidden sm:inline text-[11px] text-muted-foreground font-medium">
            Checkout Terenkripsi
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Delivery Address & Store Grouped Items */}
          <div className="lg:col-span-2 space-y-5">
            <CheckoutAddressCard
              address={address}
              onChangeAddressClick={() => setIsAddressModalOpen(true)}
              onAddAddressClick={() => router.push("/profile/addresses/create")}
              isLoading={isLoading}
            />

            {/* Store Group Cards */}
            <div className="space-y-4">
              {stores.map((store) => (
                <CheckoutStoreCard key={store.sellerId} store={store} />
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky Desktop) */}
          <div className="lg:col-span-1 lg:sticky lg:top-20">
            <CheckoutSummary
              pricing={computedPricing}
              hasAddress={Boolean(address)}
              onPlaceOrder={handlePlaceOrder}
              isLoading={isLoading}
            />
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Footer */}
      <CheckoutFooter
        total={computedPricing.total}
        hasAddress={Boolean(address)}
        onPlaceOrder={handlePlaceOrder}
        isLoading={isLoading}
      />

      {/* Address Selection Modal */}
      <AddressSelectionDialog
        isOpen={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        selectedAddressId={address?.id || selectedAddressId || undefined}
        onSelectAddress={handleSelectAddress}
      />

      {/* Interactive Payment Modal */}
      {createdPaymentInfo && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onOpenChange={(open) => {
            setIsPaymentModalOpen(open);
            if (!open) {
              router.push(`/profile/orders/${createdPaymentInfo.orderId}`);
            }
          }}
          orderId={createdPaymentInfo.orderId}
          paymentId={createdPaymentInfo.paymentId}
          amount={createdPaymentInfo.amount}
          orderNumber={createdPaymentInfo.orderNumber}
        />
      )}
    </div>
  );
}

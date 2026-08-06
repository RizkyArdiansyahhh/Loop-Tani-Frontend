"use client";

import { useTranslations } from "next-intl";
import { CheckoutStore } from "../types/checkout.type";
import { CheckoutItemCard } from "./checkout-item-card";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckoutStore } from "../store/checkout.store";
import { SelectedShippingOption } from "@/features/shipping/types/shipping.type";
import { ShippingRadioGroup } from "@/features/shipping/components/shipping-radio-group";

interface CheckoutStoreCardProps {
  store: CheckoutStore;
  destinationId?: number;
}

export function CheckoutStoreCard({
  store,
  destinationId = 54,
}: CheckoutStoreCardProps) {
  const t = useTranslations("checkout");

  const selectedShippingByStore = useCheckoutStore(
    (s) => s.selectedShippingByStore
  );
  const setStoreShipping = useCheckoutStore((s) => s.setStoreShipping);

  const selectedShipping = selectedShippingByStore[store.sellerId] || null;

  const handleSelectShipping = (option: SelectedShippingOption) => {
    setStoreShipping(store.sellerId, option);
  };

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-xs bg-card font-sans">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Clean Store Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div>
            <h3 className="text-sm font-bold text-foreground font-poppins">
              {store.sellerName}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {t("store.itemCount", { count: store.items.length })}
            </p>
          </div>
        </div>

        {/* Item List */}
        <div className="divide-y divide-border/30">
          {store.items.map((item) => (
            <CheckoutItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Inline Standard Radio Shipping Options */}
        <div className="pt-2 border-t border-border/40">
          <ShippingRadioGroup
            destinationId={destinationId}
            selectedOption={selectedShipping}
            onSelectOption={handleSelectShipping}
          />
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { CheckoutStore } from "../types/checkout.type";
import { CheckoutItemCard } from "./checkout-item-card";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Card, CardContent } from "@/components/ui/card";

interface CheckoutStoreCardProps {
  store: CheckoutStore;
}

export function CheckoutStoreCard({ store }: CheckoutStoreCardProps) {
  const t = useTranslations("checkout");

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

        {/* Courier & Store Subtotal Block */}
        <div className="bg-secondary/15 rounded-xl p-3.5 border border-border/50 space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-foreground">
            <span>{t("shipping.courierLabel")}</span>
            <span className="text-primary font-bold">
              {formatCurrency(0)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {t("shipping.standardShipping")} — {t("shipping.placeholderInfo")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { CheckoutPricing } from "../types/checkout.type";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutSummaryProps {
  pricing: CheckoutPricing;
  hasAddress: boolean;
  onPlaceOrder: () => void;
  isLoading?: boolean;
}

export function CheckoutSummary({
  pricing,
  hasAddress,
  onPlaceOrder,
  isLoading = false,
}: CheckoutSummaryProps) {
  const t = useTranslations("checkout.summary");

  const isDisabled = !hasAddress || isLoading || pricing.total <= 0;

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-xs bg-card font-sans">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Header */}
        <h3 className="text-sm font-bold text-foreground font-poppins border-b border-border/40 pb-3">
          {t("title")}
        </h3>

        {/* Pricing Rows */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("subtotalItems")}</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(pricing.subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("shippingCost")}</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(pricing.shippingCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("serviceFee")}</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(pricing.serviceFee)}
            </span>
          </div>

          {pricing.discount > 0 && (
            <div className="flex justify-between items-center text-primary font-semibold">
              <span>{t("discount")}</span>
              <span>-{formatCurrency(pricing.discount)}</span>
            </div>
          )}

          {pricing.insuranceFee > 0 && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{t("insuranceFee")}</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(pricing.insuranceFee)}
              </span>
            </div>
          )}

          {pricing.applicationFee > 0 && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{t("applicationFee")}</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(pricing.applicationFee)}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border/40 pt-3 flex justify-between items-center text-sm font-bold text-foreground">
          <span>{t("totalPayment")}</span>
          <span className="text-base text-primary font-poppins font-extrabold">
            {formatCurrency(pricing.total)}
          </span>
        </div>

        {/* Text-only Place Order Button with Primary & Secondary accent */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={onPlaceOrder}
            disabled={isDisabled}
            className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded-xl shadow-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t("placeOrderBtn")}
          </Button>

          {!hasAddress && (
            <p className="text-[11px] text-destructive text-center font-medium">
              {t("disabledTooltipNoAddress")}
            </p>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground text-center font-medium pt-1">
          Jaminan Transaksi Aman & Terverifikasi
        </p>
      </CardContent>
    </Card>
  );
}

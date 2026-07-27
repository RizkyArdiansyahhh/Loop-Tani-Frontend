"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutFooterProps {
  total: number;
  hasAddress: boolean;
  onPlaceOrder: () => void;
  isLoading?: boolean;
}

export function CheckoutFooter({
  total,
  hasAddress,
  onPlaceOrder,
  isLoading = false,
}: CheckoutFooterProps) {
  const t = useTranslations("checkout.summary");

  const isDisabled = !hasAddress || isLoading || total <= 0;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xs border-t border-border p-3.5 shadow-lg font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[11px] text-muted-foreground font-medium">
            {t("totalPayment")}
          </p>
          <p className="text-base font-bold text-primary font-poppins">
            {formatCurrency(total)}
          </p>
        </div>

        <Button
          onClick={onPlaceOrder}
          disabled={isDisabled}
          className="h-11 px-6 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded-xl cursor-pointer transition-all"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
          {t("placeOrderBtn")}
        </Button>
      </div>
    </div>
  );
}

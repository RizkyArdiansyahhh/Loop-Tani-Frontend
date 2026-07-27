"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { OrderPricingSnapshot, OrderStatus } from "../types/order.type";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface OrderSummaryCardProps {
  pricing: OrderPricingSnapshot;
  status: OrderStatus;
  expiredAt: string | null;
  onPayClick?: () => void;
}

function useCountdown(expiredAtStr: string | null) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!expiredAtStr) return;

    const updateTimer = () => {
      const expiredTime = new Date(expiredAtStr).getTime();
      const now = Date.now();
      const diff = expiredTime - now;

      if (diff <= 0) {
        setTimeLeft("Waktu pembayaran telah habis");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours} jam ${minutes} menit ${seconds} detik`);
      } else {
        setTimeLeft(`${minutes} menit ${seconds} detik`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiredAtStr]);

  return timeLeft;
}

export function OrderSummaryCard({
  pricing,
  status,
  expiredAt,
  onPayClick,
}: OrderSummaryCardProps) {
  const t = useTranslations("order.detail");
  const timeLeft = useCountdown(status === "PENDING_PAYMENT" ? expiredAt : null);

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden bg-card font-sans shadow-xs">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <h3 className="text-xs font-bold text-foreground font-poppins border-b border-border/40 pb-2">
          {t("summaryTitle")}
        </h3>

        {/* Real-time Expiration Timer Alert for Pending Payment */}
        {status === "PENDING_PAYMENT" && timeLeft && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold font-poppins">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Batas Waktu Pembayaran</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold font-mono">
              {timeLeft}
            </p>
          </div>
        )}

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>{t("subtotal")}</span>
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

          {pricing.totalWeight > 0 && (
            <div className="flex justify-between items-center text-muted-foreground pt-1 border-t border-border/30">
              <span>{t("totalWeight")}</span>
              <span className="font-medium text-foreground">
                {(pricing.totalWeight / 1000).toFixed(1)} kg
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border/40 pt-3 flex justify-between items-center text-sm font-bold text-foreground">
          <span>{t("totalPrice")}</span>
          <span className="text-base text-primary font-poppins font-extrabold">
            {formatCurrency(pricing.grandTotal)}
          </span>
        </div>

        {status === "PENDING_PAYMENT" && (
          <div className="pt-1">
            <Button
              onClick={onPayClick}
              className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer transition-all gap-1.5"
            >
              <Clock className="w-4 h-4" />
              {t("payNowBtn")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

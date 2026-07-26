"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Order } from "../types/order.type";
import { OrderStatusBadge } from "./order-status-badge";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock } from "lucide-react";

interface OrderCardProps {
  order: Order;
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
        setTimeLeft("Waktu pembayaran habis");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiredAtStr]);

  return timeLeft;
}

export function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations("order.card");
  const timeLeft = useCountdown(
    order.orderStatus === "PENDING_PAYMENT" ? order.expiredAt : null,
  );

  const firstItem = order.items[0];
  const extraItemsCount = order.items.length - 1;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-xs bg-card font-sans hover:border-primary/40 transition-all">
      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground font-medium">
            <span className="font-semibold text-foreground font-poppins">
              {order.seller.storeName}
            </span>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="font-mono text-[11px]">{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {order.orderStatus === "PENDING_PAYMENT" && timeLeft && (
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/20">
                <Clock className="h-3 w-3 shrink-0" />
                {timeLeft}
              </span>
            )}
            <OrderStatusBadge status={order.orderStatus} />
          </div>
        </div>

        {/* Product Preview */}
        {firstItem && (
          <div className="flex gap-3.5 items-start">
            <div className="relative h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/60">
              {firstItem.thumbnailUrl ? (
                <Image
                  src={firstItem.thumbnailUrl}
                  alt={firstItem.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  <Package className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug font-poppins">
                {firstItem.productName}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {firstItem.quantity} barang × {formatCurrency(firstItem.productPrice)}
              </p>

              {extraItemsCount > 0 && (
                <p className="text-[11px] font-medium text-primary pt-0.5">
                  {t("moreItems", { count: extraItemsCount })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bottom Row: Total & Actions */}
        <div className="border-t border-border/40 pt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">
              {t("totalPayment")}
            </p>
            <p className="text-sm font-bold text-primary font-poppins">
              {formatCurrency(order.pricing.grandTotal)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs font-semibold border-border text-foreground hover:bg-muted/50 rounded-xl"
            >
              <Link href={`/profile/orders/${order.id}`}>
                {t("detailBtn")}
              </Link>
            </Button>

            {order.orderStatus === "PENDING_PAYMENT" && (
              <Button
                disabled
                size="sm"
                className="h-9 px-4 text-xs font-semibold bg-primary/40 text-primary-foreground opacity-60 rounded-xl cursor-not-allowed"
                title={t("comingSoonPayment")}
              >
                {t("payNowBtn")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { OrderStatus } from "../types/order.type";
import { Card, CardContent } from "@/components/ui/card";

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const t = useTranslations("order.status");

  const steps = [
    { key: "PENDING_PAYMENT", label: t("PENDING_PAYMENT") },
    { key: "PAID", label: t("PAID") },
    { key: "PROCESSING", label: t("PROCESSING") },
    { key: "SHIPPED", label: t("SHIPPED") },
    { key: "COMPLETED", label: t("COMPLETED") },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case "PENDING_PAYMENT":
        return 0;
      case "PAID":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
      case "COMPLETED":
        return 4;
      default:
        return -1;
    }
  };

  const currentIndex = getStepIndex(status);
  const isCancelled = status === "CANCELLED" || status === "EXPIRED";

  if (isCancelled) {
    return (
      <Card className="border border-destructive/40 rounded-2xl bg-destructive/5 font-sans">
        <CardContent className="p-4 sm:p-5 text-center">
          <p className="text-xs font-bold text-destructive font-poppins">
            Pesanan ini telah {t(status).toLowerCase()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden bg-card font-sans shadow-xs">
      <CardContent className="p-4 sm:p-5 space-y-3">
        <h3 className="text-xs font-bold text-foreground font-poppins border-b border-border/40 pb-2">
          Status Pesanan
        </h3>

        <div className="flex items-center justify-between relative pt-2">
          {/* Progress bar background line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-border z-0" />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10 space-y-1.5 flex-1">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground border border-border"
                  } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[10px] text-center font-medium line-clamp-1 max-w-[70px] ${
                    isCompleted ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

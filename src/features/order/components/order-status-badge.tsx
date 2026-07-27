"use client";

import { useTranslations } from "next-intl";
import { OrderStatus } from "../types/order.type";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const t = useTranslations("order.status");

  const getVariantStyles = () => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "PAID":
      case "PROCESSING":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "SHIPPED":
        return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30";
      case "DELIVERED":
      case "COMPLETED":
        return "bg-primary/15 text-primary border-primary/30";
      case "CANCELLED":
      case "EXPIRED":
        return "bg-destructive/15 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border font-sans ${getVariantStyles()}`}
    >
      {t(status)}
    </Badge>
  );
}

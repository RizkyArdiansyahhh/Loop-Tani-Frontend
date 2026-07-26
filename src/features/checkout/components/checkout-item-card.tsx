"use client";

import Image from "next/image";
import { CheckoutItem } from "../types/checkout.type";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Package } from "lucide-react";

interface CheckoutItemCardProps {
  item: CheckoutItem;
}

export function CheckoutItemCard({ item }: CheckoutItemCardProps) {
  return (
    <div className="flex gap-3 items-start py-3 border-b border-border/40 last:border-0 font-sans">
      {/* Product Image */}
      <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/60">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <Package className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
          {item.productName}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{item.quantity} barang</span>
          <span>•</span>
          <span>{(item.weight * item.quantity / 1000).toFixed(1)} kg</span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs font-bold text-foreground">
            {formatCurrency(item.price)}
          </span>
          <span className="text-xs font-bold text-primary">
            {formatCurrency(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { TopProductItem } from "../api/get-seller-analytics";
import { Package, Trophy } from "lucide-react";

interface TopProductsTableProps {
  products: TopProductItem[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const t = useTranslations("seller.analytics.topProducts");

  if (!products || products.length === 0) {
    return (
      <div className="bg-card border border-border/70 rounded-2xl p-8 text-center space-y-2 font-poppins">
        <Package className="w-8 h-8 text-muted-foreground mx-auto" />
        <p className="text-xs font-bold text-foreground">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-xs font-sans">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 font-poppins">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{t("title")}</span>
          </h3>
          <p className="text-xs text-muted-foreground pt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      <div className="divide-y divide-border/40 font-poppins">
        {products.map((product, idx) => (
          <div key={product.id} className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 text-center text-xs font-bold font-mono text-muted-foreground">
                #{idx + 1}
              </span>

              <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted/40 border border-border/60 shrink-0 flex items-center justify-center">
                {product.thumbnailUrl ? (
                  <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-bold text-foreground truncate max-w-xs">{product.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  Terjual: <span className="font-bold text-foreground font-mono">{product.totalSold} unit</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 font-poppins">
              <span className="text-xs font-bold text-primary font-mono block">
                {formatCurrency(product.totalRevenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

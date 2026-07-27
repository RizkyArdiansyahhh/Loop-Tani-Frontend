"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useOrders } from "../hooks/use-orders";
import { OrderStatus } from "../types/order.type";
import { OrderCard } from "../components/order-card";
import { OrderSkeleton } from "../components/order-skeleton";
import { Button } from "@/components/ui/button";

export function OrderListPage() {
  const t = useTranslations("order.list");
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const statusParam = activeTab === "ALL" ? undefined : activeTab;

  const { data, isLoading } = useOrders({
    status: statusParam,
    page,
    limit: 10,
  });

  const tabs: { key: OrderStatus | "ALL"; labelKey: string }[] = [
    { key: "ALL", labelKey: "all" },
    { key: "PENDING_PAYMENT", labelKey: "pending" },
    { key: "PAID", labelKey: "paid" },
    { key: "PROCESSING", labelKey: "processing" },
    { key: "SHIPPED", labelKey: "shipped" },
    { key: "COMPLETED", labelKey: "completed" },
    { key: "CANCELLED", labelKey: "cancelled" },
  ];

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-gray-950 font-sans pb-16 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold font-poppins text-foreground">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Filter Status Tabs (Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-2xs font-poppins"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border/60"
                }`}
              >
                {t(`tabs.${tab.labelKey}`)}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-card rounded-2xl border border-border/60 p-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground font-poppins">
                {t("emptyTitle")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {t("emptyDesc")}
              </p>
            </div>

            <Button asChild className="h-10 px-5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              <Link href="/marketplace">{t("exploreMarketplace")}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 text-xs font-medium text-muted-foreground border-t border-border/40">
                <span>
                  Halaman {meta.page} dari {meta.totalPages} ({meta.total} pesanan)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-3 text-xs rounded-lg"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 px-3 text-xs rounded-lg"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

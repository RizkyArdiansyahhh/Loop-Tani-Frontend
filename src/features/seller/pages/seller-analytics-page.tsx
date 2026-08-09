"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSellerAnalytics } from "../hooks/use-seller-analytics";
import { RevenueStatCard } from "../components/revenue-stat-card";
import { TopProductsTable } from "../components/top-products-table";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Recycle,
  Eye,
  RefreshCw,
  BarChart3,
  Calendar,
} from "lucide-react";

export function SellerAnalyticsPage() {
  const t = useTranslations("seller.analytics");
  const [period, setPeriod] = useState<string>("7days");
  const { data: analyticsData, isLoading, isFetching, refetch } = useSellerAnalytics(period);

  const totalRevenue = analyticsData?.totalRevenue || 0;
  const totalOrders = analyticsData?.totalOrders || 0;
  const totalItemsSold = analyticsData?.totalItemsSold || 0;
  const totalWasteKg = analyticsData?.totalWasteKg || 0;
  const conversionRate = analyticsData?.conversionRate || "0.0%";
  const storeViews = analyticsData?.storeViews || 0;
  const topProducts = analyticsData?.topProducts || [];

  return (
    <div className="space-y-6 font-sans">
      {/* ── HEADER HALAMAN & PERIOD FILTER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-poppins">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground pt-0.5">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-poppins">
          {/* Period Selector Tabs */}
          <div className="flex items-center gap-1 bg-card border border-border/70 p-1 rounded-xl shadow-xs">
            {[
              { id: "7days", label: t("period.7days") },
              { id: "30days", label: t("period.30days") },
              { id: "6months", label: t("period.6months") },
              { id: "1year", label: t("period.1year") },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  period === p.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3.5 rounded-xl text-xs font-bold gap-2 cursor-pointer border-border/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
            <span>{t("refresh")}</span>
          </Button>
        </div>
      </div>

      {/* ── METRIC STAT CARDS GRID ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevenueStatCard
            title={t("stats.totalRevenue")}
            amount={totalRevenue}
            subtitle={t("stats.revenueSubtitle")}
            icon={TrendingUp}
            iconBgColor="bg-primary/10"
            iconTextColor="text-primary"
            isPrimary={true}
          />

          <RevenueStatCard
            title={t("stats.totalOrders")}
            amount={totalOrders}
            subtitle={t("stats.ordersSubtitle")}
            icon={ShoppingBag}
            iconBgColor="bg-blue-500/10"
            iconTextColor="text-blue-600 dark:text-blue-400"
          />

          <RevenueStatCard
            title={t("stats.itemsSold")}
            amount={totalItemsSold}
            subtitle={t("stats.itemsSubtitle")}
            icon={Package}
            iconBgColor="bg-emerald-500/10"
            iconTextColor="text-emerald-600 dark:text-emerald-400"
          />

          <RevenueStatCard
            title={t("stats.wasteRecycled")}
            amount={totalWasteKg}
            subtitle={t("stats.wasteSubtitle")}
            icon={Recycle}
            iconBgColor="bg-amber-500/10"
            iconTextColor="text-amber-600 dark:text-amber-400"
          />
        </div>
      )}

      {/* ── TRAFFIC & TOP PRODUCTS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic & Conversion Card */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-xs font-poppins flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span>{t("traffic.title")}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Tingkat kunjungan toko dan efektivitas konversi pembeli.
            </p>
          </div>

          <div className="space-y-4 py-2">
            <div className="bg-muted/30 border border-border/60 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">{t("traffic.views")}</span>
                <span className="text-xl font-bold font-mono text-foreground">{storeViews} Kunjungan</span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-muted/30 border border-border/60 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">{t("traffic.conversion")}</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{conversionRate}</span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground border-t border-border/40 pt-3">
            * Data diperbarui secara otomatis berdasarkan riwayat kunjungan dan pesanan pembeli.
          </div>
        </div>

        {/* Top 5 Best Selling Products Table */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
          ) : (
            <TopProductsTable products={topProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

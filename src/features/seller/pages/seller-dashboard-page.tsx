"use client";

import { useSellerDashboard } from "../hooks/use-seller-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Package, ShoppingCart, Users, Sparkles, ArrowRight, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardStatCard } from "../components/dashboard-stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SellerDashboardPage() {
  const { data: dashboard, isLoading, isError } = useSellerDashboard();
  const t = useTranslations("seller.dashboard");
  const { data: session } = authClient.useSession();

  const getStatusBadgeVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("complete") || s.includes("selesai")) {
      return "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400";
    }
    if (s.includes("pending") || s.includes("tunda") || s.includes("menunggu")) {
      return "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400";
    }
    return "bg-sky-50 border-sky-100 text-sky-700 dark:bg-sky-950/30 dark:border-sky-900 dark:text-sky-400";
  };

  const getTodayDateString = () => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 w-full rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-[350px] w-full rounded-2xl" />
          <Skeleton className="h-[350px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{t("error") || "Gagal memuat data dashboard penjual."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Dashboard Top Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/50 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-950/80 dark:via-teal-950/80 dark:to-emerald-950/70 p-6 sm:p-8 text-white shadow-md">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-black/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase select-none">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dashboard Mitra Penjual</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-fraunces tracking-tight mt-1.5">
              Selamat Datang, {session?.user?.name || "Mitra LoopTani"}!
            </h1>
            <p className="text-xs text-emerald-100/90 font-medium">
              Hari ini: {getTodayDateString()}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className="bg-white hover:bg-slate-50 text-emerald-700 font-bold text-xs h-9.5 rounded-xl shadow-xs cursor-pointer"
            >
              <Link href="/seller/products">
                Kelola Produk
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Metric Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title={t("stats.todayRevenue") || "Pemasukan Hari Ini"}
          value={formatCurrency(dashboard.todayRevenue)}
          icon={DollarSign}
          trend={{ value: 12.5, label: t("stats.vsYesterday") || "vs kemarin" }}
        />
        <DashboardStatCard
          title={t("stats.monthlyRevenue") || "Omzet Bulan Ini"}
          value={formatCurrency(dashboard.monthlyRevenue)}
          icon={DollarSign}
          trend={{ value: 8.2, label: t("stats.vsLastMonth") || "vs bulan lalu" }}
        />
        <DashboardStatCard
          title={t("stats.ordersCount") || "Jumlah Transaksi"}
          value={dashboard.ordersCount.toString()}
          icon={ShoppingCart}
          trend={{ value: -2.4, label: t("stats.vsLastMonth") || "vs bulan lalu" }}
        />
        <DashboardStatCard
          title={t("stats.visitorsCount") || "Pengunjung Unik"}
          value={dashboard.visitorsCount.toString()}
          icon={Users}
          description={t("stats.conversion", { rate: dashboard.conversionRate }) || `Konversi: ${dashboard.conversionRate}%`}
        />
      </div>

      {/* ── Bottom Section: Recent Orders & Stock Alert ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Panel */}
        <Card className="lg:col-span-7 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
              {t("recentOrders.title") || "Pesanan Terbaru"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {t("recentOrders.description") || "Pantau transaksi penjualan limbah pertanian terakhir Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {dashboard.recentOrders.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {dashboard.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {order.buyer}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {new Date(order.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </p>
                      <Badge variant="outline" className={`text-[10px] font-bold border rounded-md px-2 py-0.5 ${getStatusBadgeVariant(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("recentOrders.empty") || "Belum ada pesanan masuk terbaru."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert Panel */}
        <Card className="lg:col-span-5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                  {t("lowStock.title") || "Stok Hampir Habis"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {t("lowStock.description") || "Segera perbarui jumlah stok produk Anda"}
                </CardDescription>
              </div>
              <Badge variant="destructive" className="ml-auto text-[10px] font-bold rounded-md bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border-red-200">
                {dashboard.lowStockCount} {t("lowStock.items") || "Produk"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {dashboard.lowStockProducts.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {dashboard.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0 pr-4 space-y-0.5">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {product.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold font-mono bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 rounded-md">
                      Sisa: {product.stock}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Package className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("lowStock.empty") || "Semua stok produk Anda aman."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

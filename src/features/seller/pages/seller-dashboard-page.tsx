"use client";

import * as React from "react";
import { useSellerDashboard } from "../hooks/use-seller-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowUpRight, ArrowDownRight, Package, ShoppingCart, DollarSign, Users, Store, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo interactive chart data (30 days analytics)
const analyticsChartData = [
  { date: "2026-07-01", revenue: 450000, orders: 3, visitors: 45 },
  { date: "2026-07-03", revenue: 820000, orders: 5, visitors: 78 },
  { date: "2026-07-05", revenue: 600000, orders: 4, visitors: 62 },
  { date: "2026-07-07", revenue: 1250000, orders: 8, visitors: 110 },
  { date: "2026-07-09", revenue: 980000, orders: 6, visitors: 95 },
  { date: "2026-07-11", revenue: 1400000, orders: 9, visitors: 135 },
  { date: "2026-07-13", revenue: 1100000, orders: 7, visitors: 105 },
  { date: "2026-07-15", revenue: 1750000, orders: 12, visitors: 160 },
  { date: "2026-07-17", revenue: 1300000, orders: 8, visitors: 125 },
  { date: "2026-07-19", revenue: 2100000, orders: 14, visitors: 190 },
  { date: "2026-07-21", revenue: 1850000, orders: 11, visitors: 175 },
  { date: "2026-07-23", revenue: 2400000, orders: 16, visitors: 220 },
  { date: "2026-07-25", revenue: 2150000, orders: 15, visitors: 205 },
  { date: "2026-07-26", revenue: 2850000, orders: 18, visitors: 240 },
];

const chartConfig = {
  revenue: {
    label: "Pemasukan (Rp)",
    color: "var(--color-primary, #059669)",
  },
  orders: {
    label: "Jumlah Transaksi",
    color: "#2563eb",
  },
  visitors: {
    label: "Pengunjung",
    color: "#d97706",
  },
} satisfies ChartConfig;

export function SellerDashboardPage() {
  const { data: dashboard, isLoading, isError } = useSellerDashboard();
  const t = useTranslations("seller.dashboard");
  const { data: session } = authClient.useSession();
  
  const [activeMetric, setActiveMetric] = React.useState<"revenue" | "orders">("revenue");
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d">("30d");

  const filteredChartData = React.useMemo(() => {
    const rawData = dashboard?.chartSeries && dashboard.chartSeries.length > 0 ? dashboard.chartSeries : analyticsChartData;
    if (timeRange === "7d") {
      return rawData.slice(-7);
    }
    return rawData;
  }, [timeRange, dashboard?.chartSeries]);

  const getStatusBadgeVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("complete") || s.includes("selesai") || s.includes("paid")) {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50";
    }
    if (s.includes("pending") || s.includes("tunda") || s.includes("menunggu")) {
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50";
    }
    return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50";
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
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-[320px] w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{t("error") || "Gagal memuat data dashboard penjual."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* ── Header Clean Card (Without Heavy Gradient) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border/70 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Store className="w-4 h-4" />
            <span>Dashboard Mitra Penjual</span>
          </div>
          <h1 className="text-xl font-bold font-poppins text-foreground tracking-tight">
            Selamat Datang, {session?.user?.name || "Mitra LoopTani"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {getTodayDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl h-9 px-4 cursor-pointer shadow-xs"
          >
            <Link href="/seller/products">
              Kelola Produk
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stats Metric Cards Grid (Flat & Minimal) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Revenue */}
        <Card className="border border-border/60 bg-card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.todayRevenue") || "Pemasukan Hari Ini"}</span>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">
            {formatCurrency(dashboard.todayRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.5% vs kemarin</span>
          </div>
        </Card>

        {/* Monthly Revenue */}
        <Card className="border border-border/60 bg-card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.monthlyRevenue") || "Omzet Bulan Ini"}</span>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">
            {formatCurrency(dashboard.monthlyRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.2% vs bulan lalu</span>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="border border-border/60 bg-card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.ordersCount") || "Total Transaksi"}</span>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">
            {dashboard.ordersCount} Transaksi
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-2.4% vs bulan lalu</span>
          </div>
        </Card>

        {/* Visitors */}
        <Card className="border border-border/60 bg-card rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.visitorsCount") || "Pengunjung Toko"}</span>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">
            {dashboard.visitorsCount} Pengunjung
          </div>
          <div className="text-[11px] text-muted-foreground">
            Konversi: <span className="font-semibold text-foreground">{dashboard.conversionRate}%</span>
          </div>
        </Card>
      </div>

      {/* ── Interactive Recharts Section (Shadcn Chart Component) ── */}
      <Card className="border border-border/70 rounded-2xl bg-card shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 p-5 gap-3">
          <div>
            <CardTitle className="text-sm font-bold font-poppins text-foreground">
              Grafik Performa Penjualan
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Pantau tren pemasukan dan jumlah transaksi toko Anda
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle metric */}
            <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50 text-xs">
              <button
                onClick={() => setActiveMetric("revenue")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeMetric === "revenue"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setActiveMetric("orders")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeMetric === "orders"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Transaksi
              </button>
            </div>

            {/* Time range select */}
            <Select value={timeRange} onValueChange={(val: any) => setTimeRange(val)}>
              <SelectTrigger className="h-8 text-xs w-[110px] rounded-xl border-border/60">
                <SelectValue placeholder="30 Hari" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="7d">7 Hari</SelectItem>
                <SelectItem value="30d">30 Hari</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
            <AreaChart data={filteredChartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeMetric === "revenue" ? "#059669" : "#2563eb"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={activeMetric === "revenue" ? "#059669" : "#2563eb"} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
                }}
                className="text-[11px]"
              />
              <YAxis
                hide={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) =>
                  activeMetric === "revenue"
                    ? `Rp${(val / 1000000).toFixed(1)}M`
                    : `${val}`
                }
                className="text-[11px]"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(val) =>
                      new Date(val).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    }
                    formatter={(value, name) => [
                      activeMetric === "revenue"
                        ? formatCurrency(Number(value))
                        : `${value} Transaksi`,
                      activeMetric === "revenue" ? "Pemasukan" : "Transaksi",
                    ]}
                  />
                }
              />
              <Area
                dataKey={activeMetric}
                type="monotone"
                fill="url(#fillMetric)"
                stroke={activeMetric === "revenue" ? "#059669" : "#2563eb"}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ── Bottom Grid: Recent Orders & Low Stock List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Card */}
        <Card className="lg:col-span-7 border border-border/70 bg-card rounded-2xl shadow-xs">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-sm font-bold font-poppins text-foreground">
              {t("recentOrders.title") || "Pesanan Terbaru"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {t("recentOrders.description") || "Daftar transaksi produk limbah pertanian terbaru Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {dashboard.recentOrders.length > 0 ? (
              <div className="divide-y divide-border/40">
                {dashboard.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-xs text-foreground">
                        {order.buyer}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(order.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-xs font-mono text-foreground">
                        {formatCurrency(order.total)}
                      </p>
                      <Badge variant="outline" className={`text-[10px] font-bold rounded-lg px-2 py-0.5 ${getStatusBadgeVariant(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  {t("recentOrders.empty") || "Belum ada pesanan masuk terbaru."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products Card */}
        <Card className="lg:col-span-5 border border-border/70 bg-card rounded-2xl shadow-xs">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold font-poppins text-foreground">
                  {t("lowStock.title") || "Stok Hampir Habis"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {t("lowStock.description") || "Segera perbarui jumlah stok produk"}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200/50">
                {dashboard.lowStockCount} Produk
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {dashboard.lowStockProducts.length > 0 ? (
              <div className="divide-y divide-border/40">
                {dashboard.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0 pr-3 space-y-0.5">
                      <p className="font-semibold text-xs text-foreground truncate">
                        {product.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono font-bold bg-muted/60 text-foreground border-border/60 rounded-md">
                      Sisa: {product.stock}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-1">
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

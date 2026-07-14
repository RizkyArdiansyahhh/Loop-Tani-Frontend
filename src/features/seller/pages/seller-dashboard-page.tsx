"use client";

import { useSellerDashboard } from "../hooks/use-seller-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Package, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardStatCard } from "../components/dashboard-stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function SellerDashboardPage() {
  const { data: dashboard, isLoading, isError } = useSellerDashboard();
  const t = useTranslations("seller.dashboard");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{t("error")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title={t("stats.todayRevenue")}
          value={formatCurrency(dashboard.todayRevenue)}
          icon={DollarSign}
          trend={{ value: 12.5, label: t("stats.vsYesterday") }}
        />
        <DashboardStatCard
          title={t("stats.monthlyRevenue")}
          value={formatCurrency(dashboard.monthlyRevenue)}
          icon={DollarSign}
          trend={{ value: 8.2, label: t("stats.vsLastMonth") }}
        />
        <DashboardStatCard
          title={t("stats.ordersCount")}
          value={dashboard.ordersCount.toString()}
          icon={ShoppingCart}
          trend={{ value: -2.4, label: t("stats.vsLastMonth") }}
        />
        <DashboardStatCard
          title={t("stats.visitorsCount")}
          value={dashboard.visitorsCount.toString()}
          icon={Users}
          description={t("stats.conversion", { rate: dashboard.conversionRate })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("recentOrders.title")}</CardTitle>
            <CardDescription>{t("recentOrders.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{order.buyer}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                      <Badge variant="outline" className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">{t("recentOrders.empty")}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("lowStock.title")}</CardTitle>
                <CardDescription>{t("lowStock.description")}</CardDescription>
              </div>
              <Badge variant="destructive" className="ml-auto">
                {dashboard.lowStockCount} {t("lowStock.items")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {dashboard.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-medium text-sm truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs font-mono bg-red-100 text-red-800">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">{t("lowStock.empty")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

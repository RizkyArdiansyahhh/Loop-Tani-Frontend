"use client";

import { useAdminDashboard } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Store,
  Clock,
  Package,
  BookOpen,
  Video,
  Coins,
  ShieldAlert,
} from "lucide-react";

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard");
  const { data: stats, isLoading, error } = useAdminDashboard();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50/50 rounded-2xl border border-red-200">
        <ShieldAlert className="w-12 h-12 text-red-600 mb-4" />
        <h3 className="text-lg font-bold text-red-800">Gagal Memuat Data</h3>
        <p className="text-red-600 mt-2">Terjadi kesalahan saat memuat analitik dashboard.</p>
      </div>
    );
  }

  const statItems = [
    {
      title: t("totalUsers"),
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: t("totalSellers"),
      value: stats?.totalSellers ?? 0,
      icon: Store,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: t("pendingSellers"),
      value: stats?.pendingSellers ?? 0,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: t("totalProducts"),
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: t("totalArticles"),
      value: stats?.totalArticles ?? 0,
      icon: BookOpen,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100",
    },
    {
      title: t("totalVideos"),
      value: stats?.totalVideos ?? 0,
      icon: Video,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      title: t("totalPoints"),
      value: stats?.totalPoints ?? 0,
      icon: Coins,
      color: "text-yellow-600 bg-yellow-50 border-yellow-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("systemTitle")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="rounded-2xl shadow-xs border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : statItems.map((item, i) => (
              <Card key={i} className="rounded-2xl shadow-xs border bg-card transition-all hover:shadow-md hover:scale-[1.01] duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
                  <div className={`p-2 rounded-xl border ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-2xl font-bold text-foreground">
                    {item.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}

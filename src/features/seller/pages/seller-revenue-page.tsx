"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSellerRevenue } from "../hooks/use-seller-revenue";
import { RevenueStatCard } from "../components/revenue-stat-card";
import { RevenueTransactionTable } from "../components/revenue-transaction-table";
import { PayoutModal } from "../components/payout-modal";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Clock, CheckCircle2, RefreshCw } from "lucide-react";

export function SellerRevenuePage() {
  const t = useTranslations("seller.revenue");
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const { data: revenueData, isLoading, isFetching, refetch } = useSellerRevenue();

  const availableBalance = revenueData?.availableBalance || 0;
  const totalRevenue = revenueData?.totalRevenue || 0;
  const pendingBalance = revenueData?.pendingBalance || 0;
  const withdrawnTotal = revenueData?.withdrawnTotal || 0;
  const bankAccount = revenueData?.bankAccount || {
    bankName: "Bank BCA",
    accountNumber: "8820****192",
    accountHolder: "Toko Tani",
  };
  const transactions = revenueData?.transactions || [];

  return (
    <div className="space-y-6 font-sans">
      {/* ── HEADER HALAMAN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-poppins">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground pt-0.5">
            {t("description")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 px-3.5 rounded-xl text-xs font-bold gap-2 cursor-pointer border-border/60 font-poppins self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
          <span>{t("refresh")}</span>
        </Button>
      </div>

      {/* ── STATS CARDS GRID ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevenueStatCard
            title={t("stats.availableBalance")}
            amount={availableBalance}
            subtitle={t("stats.availableSubtitle")}
            icon={Wallet}
            actionLabel={t("stats.withdrawCta")}
            onAction={() => setIsPayoutModalOpen(true)}
            isPrimary={true}
          />

          <RevenueStatCard
            title={t("stats.totalRevenue")}
            amount={totalRevenue}
            subtitle={t("stats.totalSubtitle")}
            icon={TrendingUp}
            iconBgColor="bg-emerald-500/10"
            iconTextColor="text-emerald-600 dark:text-emerald-400"
          />

          <RevenueStatCard
            title={t("stats.pendingBalance")}
            amount={pendingBalance}
            subtitle={t("stats.pendingSubtitle")}
            icon={Clock}
            iconBgColor="bg-amber-500/10"
            iconTextColor="text-amber-600 dark:text-amber-400"
          />

          <RevenueStatCard
            title={t("stats.withdrawnTotal")}
            amount={withdrawnTotal}
            subtitle={t("stats.withdrawnSubtitle")}
            icon={CheckCircle2}
            iconBgColor="bg-blue-500/10"
            iconTextColor="text-blue-600 dark:text-blue-400"
          />
        </div>
      )}

      {/* ── TRANSACTIONS TABLE ── */}
      {isLoading ? (
        <div className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
      ) : (
        <RevenueTransactionTable transactions={transactions} />
      )}

      {/* ── PAYOUT MODAL ── */}
      <PayoutModal
        open={isPayoutModalOpen}
        onOpenChange={setIsPayoutModalOpen}
        availableBalance={availableBalance}
        bankAccount={bankAccount}
      />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import type { SellerTransaction } from "../api/get-seller-revenue";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";

interface RevenueTransactionTableProps {
  transactions: SellerTransaction[];
}

export function RevenueTransactionTable({ transactions }: RevenueTransactionTableProps) {
  const t = useTranslations("seller.revenue.table");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "WITHDRAWAL">("ALL");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType =
        typeFilter === "ALL" ? true : tx.type === typeFilter;
      const matchesSearch =
        search === "" ||
        tx.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
        tx.title.toLowerCase().includes(search.toLowerCase()) ||
        tx.description.toLowerCase().includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, search]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-xs font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-poppins">
        <div>
          <h3 className="text-base font-bold text-foreground">{t("title")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: "ALL", label: t("tabs.all") },
            { id: "INCOME", label: t("tabs.income") },
            { id: "WITHDRAWAL", label: t("tabs.withdrawal") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeFilter === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative font-poppins">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 text-xs h-10 rounded-xl border-border/60 font-sans"
        />
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="py-12 text-center space-y-2 font-poppins border border-dashed border-border/60 rounded-xl">
          <p className="text-xs font-bold text-foreground">{t("emptyTitle")}</p>
          <p className="text-[11px] text-muted-foreground">
            {search ? t("emptyDescSearch") : t("emptyDescAll")}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === "INCOME";

            return (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 font-poppins">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-bold text-foreground truncate">{tx.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground/80 font-mono">{formatDate(tx.date)}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <span
                    className={`text-xs font-bold font-mono block ${
                      isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>

                  {tx.status === "COMPLETED" ? (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold px-2 py-0">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> {t("statusCompleted")}
                    </Badge>
                  ) : tx.status === "PENDING" ? (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] font-bold px-2 py-0">
                      <Clock className="w-2.5 h-2.5 mr-0.5" /> {t("statusPending")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[9px] font-bold px-2 py-0">
                      <XCircle className="w-2.5 h-2.5 mr-0.5" /> {t("statusCancelled")}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

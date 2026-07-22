"use client";

import { useState } from "react";
import { useAdminPointTransactions } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Coins, ArrowUpRight, ArrowDownLeft, ShieldAlert } from "lucide-react";

export default function PointTransactionsPage() {
  const t = useTranslations("admin.pointTransactions");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: transactionResp, isLoading, error } = useAdminPointTransactions(page, 10, search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 rounded-2xl bg-card border shadow-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-6 bg-red-50 text-red-800 rounded-2xl border border-red-200">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <span>Gagal memuat riwayat transaksi poin.</span>
        </div>
      ) : !transactionResp || transactionResp.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Coins className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Belum ada transaksi poin dicatat.</h3>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("table.user")}</th>
                  <th className="p-4">{t("table.type")}</th>
                  <th className="p-4">{t("table.amount")}</th>
                  <th className="p-4">{t("table.description")}</th>
                  <th className="p-4">{t("table.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {transactionResp.data.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{tx.user.name}</div>
                      <div className="text-xs text-muted-foreground">{tx.user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1">
                        {tx.type === "EARN" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 rounded-lg text-[10px] font-semibold px-2 py-0.5 inline-flex items-center gap-0.5">
                            <ArrowUpRight className="h-3 w-3" />
                            {t("types.earn")}
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 rounded-lg text-[10px] font-semibold px-2 py-0.5 inline-flex items-center gap-0.5">
                            <ArrowDownLeft className="h-3 w-3" />
                            {t("types.redeem")}
                          </Badge>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-bold text-base ${tx.type === "EARN" ? "text-emerald-600" : "text-rose-600"}`}>
                        {tx.type === "EARN" ? "+" : "-"}{tx.amount} LP
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs max-w-xs md:max-w-md truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactionResp.meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Halaman {page} dari {transactionResp.meta.totalPages} (Total {transactionResp.meta.total} Transaksi)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl"
                >
                  Sebelumnya
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === transactionResp.meta.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

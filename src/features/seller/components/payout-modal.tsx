"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { useRequestPayout } from "../hooks/use-request-payout";
import type { SellerBankAccount } from "../api/get-seller-revenue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wallet, ArrowRight, ShieldCheck } from "lucide-react";

interface PayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  bankAccount: SellerBankAccount;
}

export function PayoutModal({
  open,
  onOpenChange,
  availableBalance,
  bankAccount,
}: PayoutModalProps) {
  const t = useTranslations("seller.revenue.modal");
  const [amount, setAmount] = useState<string>("");
  const requestPayoutMutation = useRequestPayout();

  const numAmount = Number(amount) || 0;
  const isInvalid = numAmount < 10000 || numAmount > availableBalance;

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) {
      toast.error(
        numAmount < 10000
          ? t("minError")
          : t("maxError")
      );
      return;
    }

    requestPayoutMutation.mutate(
      {
        amount: numAmount,
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || t("toastSuccess"));
          onOpenChange(false);
          setAmount("");
        },
        onError: () => {
          toast.error(t("toastError"));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 font-sans border-border/80">
        <DialogHeader className="border-b border-border/40 pb-3">
          <DialogTitle className="text-base font-bold font-poppins flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span>{t("title")}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 font-poppins">
          {/* Target Bank Card */}
          <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("bankAccountTitle")}</span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> {t("verified")}
              </Badge>
            </div>
            <p className="font-bold text-xs text-foreground pt-0.5">{bankAccount.bankName} - {bankAccount.accountNumber}</p>
            <p className="text-[11px] text-muted-foreground">a.n. {bankAccount.accountHolder}</p>
          </div>

          {/* Amount Input & Available Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="payout-amount" className="font-semibold text-foreground">
                {t("amountLabel")}
              </label>
              <span className="text-[11px] text-muted-foreground">
                {t("availableHint", { amount: formatCurrency(availableBalance) })}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-muted-foreground">
                Rp
              </span>
              <Input
                id="payout-amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-11 text-sm font-mono rounded-xl border-border/60"
              />
            </div>

            {/* Quick Amount Selection Pills */}
            <div className="flex items-center gap-1.5 pt-1">
              {[50000, 100000, 500000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(Math.min(preset, availableBalance).toString())}
                  className="px-2.5 py-1 rounded-lg border border-border/60 text-[10px] font-mono font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {formatCurrency(preset)}
                </button>
              ))}
              <button
                type="button"
                onClick={handleWithdrawAll}
                className="px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 text-primary text-[10px] font-bold transition-colors cursor-pointer"
              >
                {t("withdrawAll")}
              </button>
            </div>
          </div>

          <DialogFooter className="border-t border-border/40 pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-5 rounded-xl text-xs font-bold border-border/60 cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isInvalid || requestPayoutMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
            >
              {requestPayoutMutation.isPending ? t("submitting") : t("submit")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

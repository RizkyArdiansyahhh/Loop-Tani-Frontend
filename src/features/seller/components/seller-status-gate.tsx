"use client";

import { useSellerMe } from "../hooks/use-seller-me";
import { useSimulateApprove } from "../hooks/use-simulate-approve";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Store, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface SellerStatusGateProps {
  children: React.ReactNode;
}

export function SellerStatusGate({ children }: SellerStatusGateProps) {
  const { data: sellerMe, isLoading, error, refetch } = useSellerMe();
  const router = useRouter();
  const t = useTranslations("seller.gate");
  const simulateApproveMutation = useSimulateApprove();

  const isNotRegistered = error && (error as any).response?.status === 404;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-4 font-sans">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <Skeleton className="h-4 w-56 rounded-lg" />
        <Skeleton className="h-4 w-40 rounded-lg" />
      </div>
    );
  }

  // 1. User belum mendaftar seller
  if (isNotRegistered) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 font-sans">
        <Card className="border border-border bg-card rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Store className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-poppins text-foreground">
              {t("notRegisteredTitle")}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
              {t("notRegisteredDescription")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild variant="outline" className="rounded-xl px-5 h-9 text-xs font-semibold w-full sm:w-auto cursor-pointer">
              <Link href="/profile">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                {t("backButton")}
              </Link>
            </Button>
            <Button asChild className="rounded-xl px-5 h-9 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs w-full sm:w-auto cursor-pointer">
              <Link href="/seller/register" className="flex items-center gap-1.5 font-poppins">
                {t("registerButton")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!sellerMe) {
    return null;
  }

  // 2. Status Toko Belum Aktif (PENDING / REJECTED)
  if (sellerMe.status !== "ACTIVE") {
    const isPending = sellerMe.status === "PENDING";
    const isRejected = sellerMe.status === "REJECTED";

    return (
      <div className="max-w-lg mx-auto py-12 px-4 font-sans">
        <Card className="border border-border bg-card rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          
          {/* Tokopedia Clean Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-poppins text-foreground">
                  {sellerMe.storeName}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isPending
                      ? "bg-muted text-muted-foreground border-border"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {isPending ? t("badgePending") : t("badgeRejected")}
                </Badge>
              </div>
              {(sellerMe.city || sellerMe.province) && (
                <p className="text-xs text-muted-foreground">
                  {[sellerMe.city, sellerMe.province].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs h-8 rounded-lg px-3 font-medium cursor-pointer"
            >
              {t("checkStatus")}
            </Button>
          </div>

          {/* Body Message */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground font-poppins">
              {isPending ? t("pendingTitle") : t("rejectedTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isPending ? t("pendingDescription") : t("rejectedDescription")}
            </p>
          </div>

          {/* Quick Testing Option (Demo Approve) */}
          {isPending && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {t("testingBoxTitle")}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {t("testingBoxBadge")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("testingBoxDescription")}
              </p>
              <Button
                onClick={() => simulateApproveMutation.mutate({ status: "ACTIVE" })}
                disabled={simulateApproveMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl h-9 shadow-xs cursor-pointer"
              >
                {simulateApproveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  t("simulateApproveButton")
                )}
              </Button>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button asChild variant="outline" className="rounded-xl px-4 h-9 text-xs font-semibold cursor-pointer">
              <Link href="/profile">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                {t("backButton")}
              </Link>
            </Button>

            {isRejected && (
              <Button asChild className="rounded-xl px-4 h-9 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                <Link href="/seller/register">
                  {t("reRegisterButton")}
                </Link>
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

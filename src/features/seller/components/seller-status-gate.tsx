"use client";

import { useSellerMe } from "../hooks/use-seller-me";
import { useSimulateApprove } from "../hooks/use-simulate-approve";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Store, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface SellerStatusGateProps {
  children: React.ReactNode;
}

export function SellerStatusGate({ children }: SellerStatusGateProps) {
  const { data: sellerMe, isLoading, error } = useSellerMe();
  const router = useRouter();
  const t = useTranslations("seller.gate");
  const simulateApproveMutation = useSimulateApprove();

  // If we receive a 404/not found error, they need to register
  const isNotRegistered = error && (error as any).response?.status === 404;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  if (isNotRegistered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Store className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t("notRegisteredTitle")}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          {t("notRegisteredDescription")}
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/profile">{t("backButton")}</Link>
          </Button>
          <Button asChild>
            <Link href="/seller/register">{t("registerButton")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!sellerMe) {
    return null;
  }

  if (sellerMe.status !== "ACTIVE") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("accessDenied")}</AlertTitle>
          <AlertDescription>
            {t("statusMessage", { status: sellerMe.status })}
          </AlertDescription>
        </Alert>
        
        {sellerMe.status === "PENDING" && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <p className="text-muted-foreground max-w-md">
              {t("pendingDescription")}
            </p>
            <Button
              onClick={() => simulateApproveMutation.mutate({ status: "ACTIVE" })}
              disabled={simulateApproveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl px-6 py-5 shadow-sm transition-all hover:scale-102 duration-200"
            >
              {simulateApproveMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Simulasi Setujui Toko (Dev Mode)
            </Button>
          </div>
        )}
        
        {sellerMe.status !== "PENDING" && (
          <div className="mb-8" />
        )}
        
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/profile">{t("backButton")}</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

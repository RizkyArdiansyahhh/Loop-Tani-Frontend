"use client";

import { useTranslations } from "next-intl";
import { SellerStatus } from "@/types/api";
import { Badge } from "@/components/ui/badge";

interface SellerStatusBadgeProps {
  status: SellerStatus;
}

export function SellerStatusBadge({ status }: SellerStatusBadgeProps) {
  const t = useTranslations("profile.sellerStatus");

  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
          {t("active") || "Toko Aktif"}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
          {t("pending") || "Menunggu Verifikasi"}
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
          {t("rejected") || "Ditolak"}
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
          {t("suspended") || "Ditangguhkan"}
        </Badge>
      );
    default:
      return null;
  }
}

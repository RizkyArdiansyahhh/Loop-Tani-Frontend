"use client";

import { useTranslations } from "next-intl";
import { SellerStatus } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Store, Clock, AlertCircle, Ban } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SellerStatusBadgeProps {
  status: SellerStatus;
}

export function SellerStatusBadge({ status }: SellerStatusBadgeProps) {
  const t = useTranslations("profile.sellerStatus");

  switch (status) {
    case "ACTIVE":
      return (
        <div className="flex flex-col items-center gap-2">
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <Store className="w-3 h-3 mr-1" />
            {t("active")}
          </Badge>
          <Link href="/seller" className="text-xs text-primary hover:underline font-medium">
            {t("dashboardLink")}
          </Link>
        </div>
      );
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
          <Clock className="w-3 h-3 mr-1" />
          {t("pending")}
        </Badge>
      );
    case "REJECTED":
      return (
        <div className="flex flex-col items-center gap-2">
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t("rejected")}
          </Badge>
          <Link href="/seller/register" className="text-xs text-primary hover:underline font-medium">
            {t("reapplyLink")}
          </Link>
        </div>
      );
    case "SUSPENDED":
      return (
        <Badge variant="destructive" className="bg-red-800 hover:bg-red-900">
          <Ban className="w-3 h-3 mr-1" />
          {t("suspended")}
        </Badge>
      );
    default:
      return null;
  }
}

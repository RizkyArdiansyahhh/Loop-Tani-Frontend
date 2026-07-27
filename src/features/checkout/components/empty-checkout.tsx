"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type EmptyCheckoutReason = "EMPTY_CART" | "OUT_OF_STOCK" | "NO_ADDRESS" | "ERROR";

interface EmptyCheckoutProps {
  reason?: EmptyCheckoutReason;
  errorMessage?: string;
}

export function EmptyCheckout({
  reason = "EMPTY_CART",
  errorMessage,
}: EmptyCheckoutProps) {
  const t = useTranslations("checkout.empty");

  const getContent = () => {
    switch (reason) {
      case "OUT_OF_STOCK":
        return {
          title: t("outOfStockTitle"),
          desc: errorMessage || t("outOfStockDesc"),
          btnText: t("backToShopping"),
          btnHref: "/marketplace",
        };
      case "NO_ADDRESS":
        return {
          title: t("noAddressTitle"),
          desc: t("noAddressDesc"),
          btnText: "Tambah Alamat Baru",
          btnHref: "/profile/addresses/create",
        };
      case "ERROR":
        return {
          title: t("errorTitle"),
          desc: errorMessage || t("errorDesc"),
          btnText: t("backToShopping"),
          btnHref: "/marketplace",
        };
      case "EMPTY_CART":
      default:
        return {
          title: t("emptyCartTitle"),
          desc: t("emptyCartDesc"),
          btnText: t("backToShopping"),
          btnHref: "/marketplace",
        };
    }
  };

  const content = getContent();

  return (
    <div className="max-w-md mx-auto py-16 px-4 font-sans">
      <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-xs bg-card text-center">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground font-poppins">
              {content.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {content.desc}
            </p>
          </div>

          <div className="pt-2">
            <Button asChild className="h-10 px-6 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer transition-all">
              <Link href={content.btnHref}>
                {content.btnText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

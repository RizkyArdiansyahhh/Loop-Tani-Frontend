"use client";

import { useTranslations } from "next-intl";
import { CheckoutAddress } from "../types/checkout.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface CheckoutAddressCardProps {
  address: CheckoutAddress | null;
  onChangeAddressClick: () => void;
  onAddAddressClick: () => void;
  isLoading?: boolean;
}

export function CheckoutAddressCard({
  address,
  onChangeAddressClick,
  onAddAddressClick,
  isLoading = false,
}: CheckoutAddressCardProps) {
  const t = useTranslations("checkout.address");

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-xs bg-card font-sans">
      <CardContent className="p-4 sm:p-5 space-y-3">
        {/* Clean Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h2 className="text-sm font-bold text-foreground font-poppins">{t("title")}</h2>

          {address && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeAddressClick}
              disabled={isLoading}
              className="h-8 px-3 text-xs font-semibold border-primary/30 text-primary hover:bg-secondary/20 hover:text-primary rounded-lg cursor-pointer transition-colors"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
              {t("changeBtn")}
            </Button>
          )}
        </div>

        {/* Address Body */}
        {address ? (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-foreground font-poppins">
                {address.recipientName}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                ({address.recipientPhone})
              </span>
              {address.isDefault && (
                <Badge className="bg-primary hover:bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.2 border-0 rounded-md">
                  {t("primaryBadge")}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              {address.fullAddress}
            </p>
          </div>
        ) : (
          <div className="py-4 text-center space-y-3">
            <p className="text-xs text-muted-foreground">{t("noAddressDesc")}</p>
            <Button
              onClick={onAddAddressClick}
              size="sm"
              className="h-9 px-4 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer"
            >
              {t("addAddressBtn")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

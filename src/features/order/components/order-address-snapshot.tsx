"use client";

import { useTranslations } from "next-intl";
import { OrderAddressSnapshot } from "../types/order.type";
import { Card, CardContent } from "@/components/ui/card";

interface OrderAddressSnapshotProps {
  address: OrderAddressSnapshot;
}

export function OrderAddressSnapshotCard({ address }: OrderAddressSnapshotProps) {
  const t = useTranslations("order.detail");

  const fullAddr = `${address.street}, ${address.subDistrictName}, ${address.districtName}, ${address.cityName}, ${address.provinceName}, ${address.postalCode}`;

  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden bg-card font-sans shadow-xs">
      <CardContent className="p-4 sm:p-5 space-y-2">
        <h3 className="text-xs font-bold text-foreground font-poppins border-b border-border/40 pb-2">
          {t("addressTitle")}
        </h3>

        <div className="space-y-1 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-foreground font-poppins">
              {address.recipientName}
            </span>
            <span className="text-muted-foreground font-medium">
              ({address.recipientPhone})
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {fullAddr}
          </p>

          {address.notes && (
            <p className="text-[11px] text-muted-foreground italic pt-0.5">
              Catatan: {address.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

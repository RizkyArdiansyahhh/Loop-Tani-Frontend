"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAddresses } from "@/features/address/hooks/use-address";
import { Address } from "@/features/address/types/address.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AddressSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAddressId?: string;
  onSelectAddress: (addressId: string) => void;
}

export function AddressSelectionDialog({
  isOpen,
  onOpenChange,
  selectedAddressId,
  onSelectAddress,
}: AddressSelectionDialogProps) {
  const t = useTranslations("checkout.address");
  const { data: addresses = [], isLoading } = useAddresses();

  const handleSelect = (id: string) => {
    onSelectAddress(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-2xl max-h-[85vh] flex flex-col font-sans p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border/50 text-left">
          <DialogTitle className="text-base font-bold font-poppins text-foreground">
            {t("selectAddressTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("selectAddressDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm font-semibold text-foreground font-poppins">{t("noAddressTitle")}</p>
              <p className="text-xs text-muted-foreground">
                {t("noAddressDesc")}
              </p>
            </div>
          ) : (
            addresses.map((addr: Address) => {
              const isSelected = selectedAddressId === addr.id;
              const fullAddr = `${addr.street}, ${addr.subDistrictName}, ${addr.districtName}, ${addr.cityName}, ${addr.provinceName}, ${addr.postalCode}`;

              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelect(addr.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "border-primary bg-secondary/20 shadow-2xs"
                      : "border-border/60 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground font-poppins">
                        {addr.recipientName}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        ({addr.recipientPhone})
                      </span>
                      {addr.isDefault && (
                        <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0 border-0">
                          {t("primaryBadge")}
                        </Badge>
                      )}
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-primary">
                        Terpilih
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {fullAddr}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-border/50 bg-muted/20 flex justify-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-xs font-semibold border-primary/40 text-primary hover:bg-secondary/20 rounded-xl"
          >
            <Link
              href="/profile/addresses/create"
              onClick={() => onOpenChange(false)}
            >
              {t("addAddressBtn")}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, Check, AlertCircle, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/shared/utils/currency.util";
import { useShippingOptions } from "../hooks/use-shipping-options";
import {
  GroupedCourierOption,
  SelectedShippingOption,
  ShippingServiceOption,
} from "../types/shipping.type";

interface ShippingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationId: number;
  selectedOption?: SelectedShippingOption | null;
  onSelectOption: (option: SelectedShippingOption) => void;
}

export function ShippingSheet({
  open,
  onOpenChange,
  destinationId,
  selectedOption,
  onSelectOption,
}: ShippingSheetProps) {
  const t = useTranslations("checkout");
  const {
    data: groupedCouriers,
    isLoading,
    isError,
    refetch,
  } = useShippingOptions({
    destinationId: destinationId || 54, // Default Pekanbaru / Destination ID
  });

  const handleSelect = (
    courier: GroupedCourierOption,
    service: ShippingServiceOption
  ) => {
    onSelectOption({
      courierCode: courier.courierCode,
      courierName: courier.courierName,
      serviceCode: service.serviceCode,
      serviceName: service.serviceName,
      etd: service.etd,
      cost: service.cost,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background font-sans border-l border-border/50"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border/40 text-left space-y-1">
          <SheetTitle className="text-base font-bold text-foreground font-poppins flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Pilih Pengiriman
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Pilih kurir & durasi pengiriman terbaik untuk pesanan Anda
          </p>
        </SheetHeader>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Error Fallback */}
          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/40 dark:bg-red-950/20 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Gagal memuat pilihan pengiriman
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Silakan coba lagi beberapa saat lagi.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2 text-xs rounded-full"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Grouped Couriers List */}
          {!isLoading && !isError && groupedCouriers && (
            <div className="space-y-5">
              {groupedCouriers.map((courier) => (
                <div key={courier.courierCode} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-poppins">
                      {courier.courierName}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {courier.services.map((service) => {
                      const isSelected =
                        selectedOption?.courierCode === courier.courierCode &&
                        selectedOption?.serviceCode === service.serviceCode;

                      return (
                        <div
                          key={`${courier.courierCode}-${service.serviceCode}`}
                          onClick={() => handleSelect(courier, service)}
                          className={`relative group rounded-xl p-3.5 border transition-all duration-200 cursor-pointer select-none ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-950/30 shadow-xs"
                              : "border-border/60 bg-card hover:border-emerald-600/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-foreground">
                                  {service.serviceCode}
                                </span>

                                {service.isRecommended && (
                                  <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium border-0">
                                    Recommended
                                  </Badge>
                                )}

                                {service.isCheapest && (
                                  <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium border-0">
                                    Termurah
                                  </Badge>
                                )}
                              </div>

                              <p className="text-xs text-muted-foreground leading-snug">
                                {service.serviceName} • Estimasi {service.etd} hari
                              </p>
                            </div>

                            <div className="text-right flex flex-col items-end justify-between h-full space-y-1">
                              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-poppins">
                                {formatCurrency(service.cost)}
                              </span>

                              {isSelected && (
                                <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                  <Check className="h-3.5 w-3.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

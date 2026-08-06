"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, AlertCircle, RefreshCw, PackageCheck, Clock } from "lucide-react";
import { formatCurrency } from "@/shared/utils/currency.util";
import { useShippingOptions } from "../hooks/use-shipping-options";
import {
  GroupedCourierOption,
  SelectedShippingOption,
  ShippingServiceOption,
} from "../types/shipping.type";
import { Button } from "@/components/ui/button";

interface ShippingRadioGroupProps {
  destinationId: number;
  selectedOption?: SelectedShippingOption | null;
  onSelectOption: (option: SelectedShippingOption) => void;
}

export function ShippingRadioGroup({
  destinationId,
  selectedOption,
  onSelectOption,
}: ShippingRadioGroupProps) {
  const t = useTranslations("checkout.shipping");

  const {
    data: groupedCouriers,
    isLoading,
    isError,
    refetch,
  } = useShippingOptions({
    destinationId: destinationId || 54,
  });

  // Auto-select first recommended option if nothing selected yet
  useEffect(() => {
    if (!selectedOption && groupedCouriers && groupedCouriers.length > 0) {
      const firstCourier = groupedCouriers[0];
      if (firstCourier && firstCourier.services.length > 0) {
        const recService =
          firstCourier.services.find((s) => s.isRecommended) ||
          firstCourier.services[0];

        onSelectOption({
          courierCode: firstCourier.courierCode,
          courierName: firstCourier.courierName,
          serviceCode: recService.serviceCode,
          serviceName: recService.serviceName,
          etd: recService.etd,
          cost: recService.cost,
        });
      }
    }
  }, [groupedCouriers, selectedOption, onSelectOption]);

  if (isLoading) {
    return (
      <div className="p-4 border border-border/60 rounded-2xl bg-card space-y-3 font-sans shadow-xs">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20 text-xs space-y-2 font-sans">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
          <AlertCircle className="h-4 w-4" />
          <span>{t("loadErrorTitle")}</span>
        </div>
        <p className="text-muted-foreground text-[11px]">
          {t("loadErrorDesc")}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-7 px-2.5 text-[11px] gap-1.5 rounded-lg border-red-200 hover:bg-red-100/50"
        >
          <RefreshCw className="h-3 w-3" />
          {t("retryBtn")}
        </Button>
      </div>
    );
  }

  if (!groupedCouriers || groupedCouriers.length === 0) {
    return null;
  }

  // Create list of all services for radio group matching
  const allServices: Array<{
    id: string;
    courier: GroupedCourierOption;
    service: ShippingServiceOption;
  }> = [];

  groupedCouriers.forEach((courier) => {
    courier.services.forEach((service) => {
      allServices.push({
        id: `${courier.courierCode}-${service.serviceCode}`,
        courier,
        service,
      });
    });
  });

  const selectedId = selectedOption
    ? `${selectedOption.courierCode}-${selectedOption.serviceCode}`
    : allServices[0]?.id;

  const handleRadioChange = (val: string) => {
    const matched = allServices.find((item) => item.id === val);
    if (matched) {
      onSelectOption({
        courierCode: matched.courier.courierCode,
        courierName: matched.courier.courierName,
        serviceCode: matched.service.serviceCode,
        serviceName: matched.service.serviceName,
        etd: matched.service.etd,
        cost: matched.service.cost,
      });
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground font-poppins flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-primary" />
          {t("selectTitle")}
        </h4>
      </div>

      <RadioGroup
        value={selectedId}
        onValueChange={handleRadioChange}
        className="space-y-4"
      >
        {groupedCouriers.map((courier) => (
          <div key={courier.courierCode} className="space-y-2">
            {/* Courier Header */}
            <div className="flex items-center gap-2 pb-1 border-b border-border/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-poppins">
                {courier.courierName}
              </span>
            </div>

            {/* Courier Services Radio Cards */}
            <div className="space-y-2">
              {courier.services.map((service) => {
                const id = `${courier.courierCode}-${service.serviceCode}`;
                const isSelected = selectedId === id;

                return (
                  <Label
                    key={id}
                    htmlFor={id}
                    className={`relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/20"
                        : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <RadioGroupItem
                        value={id}
                        id={id}
                        className="mt-0.5 shrink-0 border-primary text-primary focus-visible:ring-primary"
                      />

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground font-poppins">
                            {service.serviceCode}
                          </span>

                          {service.isRecommended && (
                            <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground text-[9px] px-2 py-0.5 rounded-full font-semibold border-0 shadow-2xs">
                              {t("recommendedBadge")}
                            </Badge>
                          )}

                          {service.isCheapest && (
                            <Badge className="bg-emerald-700 dark:bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-semibold border-0 shadow-2xs">
                              {t("cheapestBadge")}
                            </Badge>
                          )}
                        </div>

                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <span>{service.serviceName}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-foreground/80 font-medium">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {t("etdDays", { etd: service.etd })}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <span className="text-sm font-extrabold text-primary font-poppins">
                        {formatCurrency(service.cost)}
                      </span>
                    </div>
                  </Label>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

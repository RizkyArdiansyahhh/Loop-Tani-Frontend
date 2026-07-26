"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Address } from "../types/address.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSetDefaultAddress } from "../hooks/use-set-default-address";
import { useDeleteAddress } from "../hooks/use-delete-address";
import { DeleteAddressDialog } from "./delete-address-dialog";
import { MapPin, Phone, User, Check, Edit2, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const t = useTranslations("address.card");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();

  const handleSetDefault = () => {
    setDefaultMutation.mutate(address.id);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(address.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
      },
    });
  };

  return (
    <>
      <Card className={`w-full ring-0 border rounded-xl overflow-hidden shadow-3xs transition-all duration-200 ${
        address.isDefault
          ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5 dark:border-emerald-700"
          : "border-gray-250 dark:border-gray-800 dark:bg-gray-900"
      }`}>
        <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4 md:items-start">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges & Labels */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {address.type}
              </Badge>
              {address.label && (
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-48">
                  {address.label}
                </span>
              )}
              {address.isDefault && (
                <Badge className="bg-emerald-600 hover:bg-emerald-600 dark:bg-emerald-600 border-0 font-semibold text-[10px] px-2 py-0.5 text-white flex items-center gap-1">
                  <Check className="h-3 w-3 shrink-0" />
                  {t("defaultBadge")}
                </Badge>
              )}
            </div>

            {/* Recipient Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <User className="h-4 w-4 text-gray-400 shrink-0" />
                <span>{address.recipientName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span>{address.recipientPhone}</span>
              </div>
            </div>

            {/* Address details */}
            <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-1">
              <div className="font-semibold text-gray-900 dark:text-white flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {address.street}
                </span>
              </div>
              <p className="pl-6 text-muted-foreground text-xs leading-relaxed">
                {address.subDistrictName}, {address.districtName}, {address.cityName}, {address.provinceName}, {address.postalCode}
              </p>
              {address.notes && (
                <p className="pl-6 text-[11px] text-muted-foreground/85 italic">
                  Catatan: "{address.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                isLoading={setDefaultMutation.isPending}
                className="w-full md:w-auto text-xs cursor-pointer border-gray-300 dark:border-gray-700"
              >
                {t("setDefaultBtn")}
              </Button>
            )}

            <div className="flex items-center gap-2 w-full justify-end">
              <Button asChild variant="outline" size="sm" className="cursor-pointer border-gray-300 dark:border-gray-700">
                <Link href={`/profile/addresses/${address.id}/edit`} className="flex items-center gap-1">
                  <Edit2 className="h-3.5 w-3.5" />
                  {t("editBtn")}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/20 hover:bg-destructive/10 cursor-pointer"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("deleteBtn")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteAddressDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}

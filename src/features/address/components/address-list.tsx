"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAddresses } from "../hooks/use-address";
import { AddressCard } from "./address-card";
import { AddressEmpty } from "./address-empty";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { Address } from "../types/address.type";

export function AddressList() {
  const t = useTranslations("address.page");
  const { data: addresses, isLoading, isError } = useAddresses();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5 border border-destructive/20 bg-destructive/5 text-destructive text-sm rounded-xl text-center">
        {t("errorLoading")}
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return <AddressEmpty />;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center pb-1">
        <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Daftar Alamat Pengiriman ({addresses.length})
        </h2>
        <Button asChild size="sm" className="cursor-pointer">
          <Link href="/profile/addresses/create" className="flex items-center gap-1.5 font-semibold">
            <Plus className="h-4 w-4" />
            {t("addAddress")}
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {addresses.map((address: Address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );
}

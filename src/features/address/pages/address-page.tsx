"use client";

import { useTranslations } from "next-intl";
import { AddressList } from "../components/address-list";

export function AddressPage() {
  const t = useTranslations("address.page");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-poppins text-gray-900 dark:text-white">{t("title")}</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">{t("description")}</p>
      </div>

      <AddressList />
    </div>
  );
}

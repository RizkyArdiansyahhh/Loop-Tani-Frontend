"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

export function AddressEmpty() {
  const t = useTranslations("address.empty");

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed border-gray-250 dark:border-gray-800 rounded-xl bg-gray-50/20 dark:bg-gray-900/10 text-center max-w-lg mx-auto">
      <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-primary mb-5 shadow-sm">
        <MapPin className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 font-poppins">
        {t("title")}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-6">
        {t("description")}
      </p>
      <Button asChild className="cursor-pointer">
        <Link href="/profile/addresses/create" className="flex items-center gap-1.5 font-semibold">
          <Plus className="h-4 w-4" />
          {t("btnText")}
        </Link>
      </Button>
    </div>
  );
}

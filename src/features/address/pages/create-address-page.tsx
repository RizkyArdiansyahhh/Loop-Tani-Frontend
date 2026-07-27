"use client";

import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useCreateAddress } from "../hooks/use-create-address";
import { AddressForm } from "../components/address-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function CreateAddressPage() {
  const t = useTranslations("address.page");
  const router = useRouter();
  const createAddressMutation = useCreateAddress();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      label: values.label?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
      placeId: values.placeId?.trim() || undefined,
      latitude: values.latitude || undefined,
      longitude: values.longitude || undefined,
    };
    createAddressMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/profile/addresses");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/profile/addresses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("backToList")}
        </Link>
      </div>

      <Card className="w-full ring-0 border border-gray-250 dark:border-gray-800 dark:bg-gray-900 shadow-3xs overflow-hidden rounded-xl">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-850/40 p-6 border-b border-gray-200 dark:border-gray-800/80">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white font-poppins">
            {t("addAddress")}
          </CardTitle>
          <CardDescription className="text-xs">
            Tambahkan alamat pengiriman baru untuk proses belanja Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <AddressForm
            onSubmit={handleSubmit}
            isLoading={createAddressMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

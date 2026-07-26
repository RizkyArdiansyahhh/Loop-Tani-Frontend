"use client";

import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useAddressDetail } from "../hooks/use-address";
import { useUpdateAddress } from "../hooks/use-update-address";
import { AddressForm } from "../components/address-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface EditAddressPageProps {
  id: string;
}

export function EditAddressPage({ id }: EditAddressPageProps) {
  const t = useTranslations("address.page");
  const router = useRouter();

  const { data: address, isLoading, isError } = useAddressDetail(id);
  const updateAddressMutation = useUpdateAddress();

  const handleSubmit = (values: any) => {
    updateAddressMutation.mutate(
      {
        id,
        payload: {
          type: values.type,
          label: values.label?.trim() || undefined,
          recipientName: values.recipientName,
          recipientPhone: values.recipientPhone,
          provinceId: values.provinceId,
          provinceName: values.provinceName,
          cityId: values.cityId,
          cityName: values.cityName,
          districtId: values.districtId,
          districtName: values.districtName,
          subDistrictId: values.subDistrictId,
          subDistrictName: values.subDistrictName,
          postalCode: values.postalCode,
          street: values.street,
          notes: values.notes?.trim() || undefined,
          latitude: values.latitude || undefined,
          longitude: values.longitude || undefined,
          placeId: values.placeId?.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          router.push("/profile/addresses");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (isError || !address) {
    return (
      <div className="space-y-4">
        <div>
          <Link href="/profile/addresses" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("backToList")}
          </Link>
        </div>
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{t("errorLoading")}</AlertDescription>
        </Alert>
      </div>
    );
  }

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
            {t("editAddress")}
          </CardTitle>
          <CardDescription className="text-xs">
            Ubah informasi rincian alamat pengiriman Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <AddressForm
            initialValues={address}
            onSubmit={handleSubmit}
            isLoading={updateAddressMutation.isPending}
            isEditMode={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}

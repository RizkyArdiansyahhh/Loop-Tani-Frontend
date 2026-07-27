"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { addressFormSchema, AddressFormValues } from "../schemas/address.schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProvinceSelect } from "./province-select";
import { RegencySelect } from "./regency-select";
import { DistrictSelect } from "./district-select";
import { VillageSelect } from "./village-select";
import { Loader2, MapPin, User, Phone, Tag, Home, Building2, HelpCircle } from "lucide-react";

interface AddressFormProps {
  initialValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => void;
  isLoading: boolean;
  isEditMode?: boolean;
}

export function AddressForm({
  initialValues,
  onSubmit,
  isLoading,
  isEditMode = false,
}: AddressFormProps) {
  const t = useTranslations("address.form");

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema) as any,
    defaultValues: {
      type: initialValues?.type || "HOME",
      label: initialValues?.label || "",
      recipientName: initialValues?.recipientName || "",
      recipientPhone: initialValues?.recipientPhone || "",
      provinceId: initialValues?.provinceId || "",
      provinceName: initialValues?.provinceName || "",
      cityId: initialValues?.cityId || "",
      cityName: initialValues?.cityName || "",
      districtId: initialValues?.districtId || "",
      districtName: initialValues?.districtName || "",
      subDistrictId: initialValues?.subDistrictId || "",
      subDistrictName: initialValues?.subDistrictName || "",
      postalCode: initialValues?.postalCode || "",
      street: initialValues?.street || "",
      notes: initialValues?.notes || "",
      latitude: initialValues?.latitude || null,
      longitude: initialValues?.longitude || null,
      placeId: initialValues?.placeId || "",
      isDefault: initialValues?.isDefault ?? false,
    } as AddressFormValues,
  });

  // Watch region IDs for cascading selects
  const provinceId = form.watch("provinceId");
  const cityId = form.watch("cityId");
  const districtId = form.watch("districtId");

  // Cascading Selection Handlers
  const handleSelectProvince = (prov: { id: string; name: string }) => {
    form.setValue("provinceId", prov.id, { shouldValidate: true });
    form.setValue("provinceName", prov.name, { shouldValidate: true });

    // Reset children
    form.setValue("cityId", "", { shouldValidate: true });
    form.setValue("cityName", "", { shouldValidate: true });
    form.setValue("districtId", "", { shouldValidate: true });
    form.setValue("districtName", "", { shouldValidate: true });
    form.setValue("subDistrictId", "", { shouldValidate: true });
    form.setValue("subDistrictName", "", { shouldValidate: true });
  };

  const handleSelectRegency = (reg: { id: string; name: string }) => {
    form.setValue("cityId", reg.id, { shouldValidate: true });
    form.setValue("cityName", reg.name, { shouldValidate: true });

    // Reset children
    form.setValue("districtId", "", { shouldValidate: true });
    form.setValue("districtName", "", { shouldValidate: true });
    form.setValue("subDistrictId", "", { shouldValidate: true });
    form.setValue("subDistrictName", "", { shouldValidate: true });
  };

  const handleSelectDistrict = (dist: { id: string; name: string }) => {
    form.setValue("districtId", dist.id, { shouldValidate: true });
    form.setValue("districtName", dist.name, { shouldValidate: true });

    // Reset child
    form.setValue("subDistrictId", "", { shouldValidate: true });
    form.setValue("subDistrictName", "", { shouldValidate: true });
  };

  const handleSelectVillage = (vil: { id: string; name: string }) => {
    form.setValue("subDistrictId", vil.id, { shouldValidate: true });
    form.setValue("subDistrictName", vil.name, { shouldValidate: true });
  };

  const handleFormSubmit = (values: AddressFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 font-sans">
      
      {/* Section 1: Kontak Penerima */}
      <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground font-poppins">{t("sections.recipientContact")}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Nama Penerima */}
          <Field>
            <FieldLabel htmlFor="recipientName" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("recipientName")} <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="recipientName"
                className="h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background pl-9"
                placeholder={t("placeholder.recipientName")}
                {...form.register("recipientName")}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FieldError errors={[form.formState.errors.recipientName]} />
          </Field>

          {/* 2. Nomor HP */}
          <Field>
            <FieldLabel htmlFor="recipientPhone" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("recipientPhone")} <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="recipientPhone"
                type="tel"
                className="h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background pl-9"
                placeholder={t("placeholder.recipientPhone")}
                {...form.register("recipientPhone")}
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FieldError errors={[form.formState.errors.recipientPhone]} />
          </Field>
        </div>
      </div>

      {/* Section 2: Label & Jenis Alamat */}
      <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground font-poppins">{t("sections.addressDetail")}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 3. Jenis Alamat */}
          <Field>
            <FieldLabel htmlFor="type" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("typeLabel")} <span className="text-destructive">*</span>
            </FieldLabel>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="type" className="w-full h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background">
                    <SelectValue placeholder={t("placeholder.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOME" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Home className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{t("typeHome")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="OFFICE" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-blue-600" />
                        <span>{t("typeOffice")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="OTHER" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                        <span>{t("typeOther")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.type]} />
          </Field>

          {/* 4. Label Alamat */}
          <Field>
            <FieldLabel htmlFor="label" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("labelLabel")}
            </FieldLabel>
            <Input
              id="label"
              className="h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background"
              placeholder={t("placeholder.label")}
              {...form.register("label")}
            />
            <FieldError errors={[form.formState.errors.label]} />
          </Field>
        </div>
      </div>

      {/* Section 3: Lokasi Pengiriman (Cascading Region Selects) */}
      <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground font-poppins">{t("sections.shippingLocation")}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 5. Provinsi */}
          <ProvinceSelect
            value={provinceId}
            onSelect={handleSelectProvince}
            error={form.formState.errors.provinceName || form.formState.errors.provinceId}
          />

          {/* 6. Kabupaten/Kota */}
          <RegencySelect
            provinceId={provinceId}
            value={cityId}
            onSelect={handleSelectRegency}
            error={form.formState.errors.cityName || form.formState.errors.cityId}
          />

          {/* 7. Kecamatan */}
          <DistrictSelect
            regencyId={cityId}
            value={districtId}
            onSelect={handleSelectDistrict}
            error={form.formState.errors.districtName || form.formState.errors.districtId}
          />

          {/* 8. Kelurahan/Desa */}
          <VillageSelect
            districtId={districtId}
            value={form.watch("subDistrictId")}
            onSelect={handleSelectVillage}
            error={form.formState.errors.subDistrictName || form.formState.errors.subDistrictId}
          />

          {/* 9. Kode Pos */}
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="postalCode" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("postalCode")} <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="postalCode"
              className="h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background max-w-xs"
              placeholder={t("placeholder.postalCode")}
              {...form.register("postalCode")}
            />
            <FieldError errors={[form.formState.errors.postalCode]} />
          </Field>

          {/* 10. Alamat Lengkap */}
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="street" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("street")} <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="street"
              className="min-h-24 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background resize-none"
              placeholder={t("placeholder.street")}
              {...form.register("street")}
            />
            <FieldError errors={[form.formState.errors.street]} />
          </Field>

          {/* 11. Catatan Kurir (Opsional) */}
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="notes" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("notes")}
            </FieldLabel>
            <Textarea
              id="notes"
              className="min-h-20 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background resize-none"
              placeholder={t("placeholder.notes")}
              {...form.register("notes")}
            />
            <FieldError errors={[form.formState.errors.notes]} />
          </Field>
        </div>
      </div>

      {/* Section 4: Pengaturan Alamat (12. Jadikan Alamat Utama) */}
      <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 shadow-xs">
        <Controller
          name="isDefault"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-sm font-semibold text-foreground cursor-pointer font-poppins"
                >
                  {t("isDefault")}
                </label>
                <p className="text-xs text-muted-foreground">
                  {t("isDefaultDescription")}
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          className="w-full sm:w-auto h-11 px-8 cursor-pointer font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {isEditMode ? t("submitEdit") : t("submitAdd")}
        </Button>
      </div>

    </form>
  );
}

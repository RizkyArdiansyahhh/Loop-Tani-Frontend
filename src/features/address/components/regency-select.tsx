"use client";

import { useTranslations } from "next-intl";
import { useRegencies } from "../hooks/use-regions";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface RegencySelectProps {
  provinceId?: string;
  value?: string;
  onSelect: (regency: { id: string; name: string }) => void;
  error?: { message?: string };
}

export function RegencySelect({
  provinceId,
  value,
  onSelect,
  error,
}: RegencySelectProps) {
  const t = useTranslations("address.form");
  const { data: regencies = [], isLoading } = useRegencies(provinceId || "");

  const isDisabled = !provinceId || isLoading;

  const handleValueChange = (selectedId: string) => {
    const found = regencies.find((r) => r.id === selectedId);
    if (found) {
      onSelect(found);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="regency-select" className="text-xs font-bold text-gray-700 dark:text-gray-300">
        {t("city")} <span className="text-destructive">*</span>
      </FieldLabel>
      <Select
        value={value || ""}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          id="regency-select"
          className="w-full h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t("placeholder.loadingRegencies")}</span>
            </div>
          ) : (
            <SelectValue
              placeholder={
                !provinceId
                  ? t("placeholder.selectProvinceFirst")
                  : t("placeholder.city")
              }
            />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {regencies.map((reg) => (
            <SelectItem key={reg.id} value={reg.id} className="cursor-pointer text-sm">
              {reg.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  );
}

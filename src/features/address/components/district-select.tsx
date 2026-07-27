"use client";

import { useTranslations } from "next-intl";
import { useDistricts } from "../hooks/use-regions";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface DistrictSelectProps {
  regencyId?: string;
  value?: string;
  onSelect: (district: { id: string; name: string }) => void;
  error?: { message?: string };
}

export function DistrictSelect({
  regencyId,
  value,
  onSelect,
  error,
}: DistrictSelectProps) {
  const t = useTranslations("address.form");
  const { data: districts = [], isLoading } = useDistricts(regencyId || "");

  const isDisabled = !regencyId || isLoading;

  const handleValueChange = (selectedId: string) => {
    const found = districts.find((d) => d.id === selectedId);
    if (found) {
      onSelect(found);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="district-select" className="text-xs font-bold text-gray-700 dark:text-gray-300">
        {t("district")} <span className="text-destructive">*</span>
      </FieldLabel>
      <Select
        value={value || ""}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          id="district-select"
          className="w-full h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t("placeholder.loadingDistricts")}</span>
            </div>
          ) : (
            <SelectValue
              placeholder={
                !regencyId
                  ? t("placeholder.selectCityFirst")
                  : t("placeholder.district")
              }
            />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {districts.map((dist) => (
            <SelectItem key={dist.id} value={dist.id} className="cursor-pointer text-sm">
              {dist.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  );
}

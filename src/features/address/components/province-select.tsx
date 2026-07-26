"use client";

import { useTranslations } from "next-intl";
import { useProvinces } from "../hooks/use-regions";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ProvinceSelectProps {
  value?: string;
  onSelect: (province: { id: string; name: string }) => void;
  error?: { message?: string };
}

export function ProvinceSelect({ value, onSelect, error }: ProvinceSelectProps) {
  const t = useTranslations("address.form");
  const { data: provinces = [], isLoading } = useProvinces();

  const handleValueChange = (selectedId: string) => {
    const found = provinces.find((p) => p.id === selectedId);
    if (found) {
      onSelect(found);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="province-select" className="text-xs font-bold text-gray-700 dark:text-gray-300">
        {t("province")} <span className="text-destructive">*</span>
      </FieldLabel>
      <Select
        value={value || ""}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger
          id="province-select"
          className="w-full h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t("placeholder.loadingProvinces")}</span>
            </div>
          ) : (
            <SelectValue placeholder={t("placeholder.province")} />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {provinces.map((prov) => (
            <SelectItem key={prov.id} value={prov.id} className="cursor-pointer text-sm">
              {prov.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  );
}

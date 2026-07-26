"use client";

import { useTranslations } from "next-intl";
import { useVillages } from "../hooks/use-regions";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface VillageSelectProps {
  districtId?: string;
  value?: string;
  onSelect: (village: { id: string; name: string }) => void;
  error?: { message?: string };
}

export function VillageSelect({
  districtId,
  value,
  onSelect,
  error,
}: VillageSelectProps) {
  const t = useTranslations("address.form");
  const { data: villages = [], isLoading } = useVillages(districtId || "");

  const isDisabled = !districtId || isLoading;

  const handleValueChange = (selectedId: string) => {
    const found = villages.find((v) => v.id === selectedId);
    if (found) {
      onSelect(found);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor="village-select" className="text-xs font-bold text-gray-700 dark:text-gray-300">
        {t("subDistrict")} <span className="text-destructive">*</span>
      </FieldLabel>
      <Select
        value={value || ""}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          id="village-select"
          className="w-full h-11 border-gray-250 dark:border-gray-800 rounded-lg text-sm bg-background"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t("placeholder.loadingVillages")}</span>
            </div>
          ) : (
            <SelectValue
              placeholder={
                !districtId
                  ? t("placeholder.selectDistrictFirst")
                  : t("placeholder.subDistrict")
              }
            />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {villages.map((vil) => (
            <SelectItem key={vil.id} value={vil.id} className="cursor-pointer text-sm">
              {vil.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  );
}

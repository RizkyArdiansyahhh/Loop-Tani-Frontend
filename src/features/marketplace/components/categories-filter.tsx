"use client";

import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const chipClass = cn(
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border",
  "bg-background px-5 text-sm font-semibold text-foreground",
  "transition-all duration-300 ease-in-out cursor-pointer select-none",
  "hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-xs",
  "peer-data-[state=checked]:border-primary",
  "peer-data-[state=checked]:bg-primary",
  "peer-data-[state=checked]:text-primary-foreground",
  "peer-data-[state=checked]:shadow-xs"
);

interface CategoryFilterProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function CategoryFilter({
  value,
  onValueChange,
}: CategoryFilterProps) {
  const t = useTranslations("product.categories");

  return (
    <RadioGroup
      value={value ?? "all"}
      onValueChange={onValueChange}
      className="flex flex-nowrap lg:flex-wrap items-center gap-3"
    >
      {/* 1. All */}
      <label htmlFor="cat-all" className="flex">
        <RadioGroupItem id="cat-all" value="all" className="peer sr-only" />
        <div className={chipClass}>{t("all")}</div>
      </label>

      {/* 2. Agricultural Waste */}
      <label htmlFor="cat-agricultural-waste" className="flex">
        <RadioGroupItem
          id="cat-agricultural-waste"
          value="agricultural-waste"
          className="peer sr-only"
        />
        <div className={chipClass}>{t("agricultural-waste")}</div>
      </label>

      {/* 3. Processed Product */}
      <label htmlFor="cat-processed-product" className="flex">
        <RadioGroupItem
          id="cat-processed-product"
          value="processed-product"
          className="peer sr-only"
        />
        <div className={chipClass}>{t("processed-product")}</div>
      </label>

      {/* 4. Secondhand */}
      <label htmlFor="cat-secondhand" className="flex">
        <RadioGroupItem
          id="cat-secondhand"
          value="secondhand"
          className="peer sr-only"
        />
        <div className={chipClass}>{t("secondhand")}</div>
      </label>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

      {/* 5. Favorites */}
      <label htmlFor="cat-favorites" className="flex">
        <RadioGroupItem
          id="cat-favorites"
          value="favorites"
          className="peer sr-only"
        />
        <div
          className={cn(
            chipClass,
            "peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-500 peer-data-[state=checked]:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50"
          )}
        >
          <Heart className="h-4 w-4 shrink-0 fill-current" />
          {t("favorites")}
        </div>
      </label>
    </RadioGroup>
  );
}

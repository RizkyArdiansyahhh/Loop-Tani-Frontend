"use client";

import { useCategories } from "../hooks/use-categories";
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
  const { data: categories, isLoading } = useCategories();

  // Find counts for each category
  const getCount = (slug: string) => {
    const cat = categories?.find((c) => c.slug === slug);
    return cat?._count?.products ?? 0;
  };

  return (
    <RadioGroup
      value={value ?? "all"}
      onValueChange={onValueChange}
      className="flex flex-nowrap lg:flex-wrap items-center gap-3"
    >
      {/* 1. All (Semua) */}
      <label htmlFor="cat-all" className="flex">
        <RadioGroupItem id="cat-all" value="all" className="peer sr-only" />
        <div className={chipClass}>Semua</div>
      </label>

      {/* 2. Agricultural Waste */}
      <label htmlFor="cat-agricultural-waste" className="flex">
        <RadioGroupItem
          id="cat-agricultural-waste"
          value="agricultural-waste"
          className="peer sr-only"
        />
        <div className={chipClass}>
          Limbah Pertanian
          {!isLoading && (
            <span className="text-xs opacity-75 font-normal">
              ({getCount("agricultural-waste")})
            </span>
          )}
        </div>
      </label>

      {/* 3. Processed Product */}
      <label htmlFor="cat-processed-product" className="flex">
        <RadioGroupItem
          id="cat-processed-product"
          value="processed-product"
          className="peer sr-only"
        />
        <div className={chipClass}>
          Produk Olahan
          {!isLoading && (
            <span className="text-xs opacity-75 font-normal">
              ({getCount("processed-product")})
            </span>
          )}
        </div>
      </label>

      {/* 4. Secondhand */}
      <label htmlFor="cat-secondhand" className="flex">
        <RadioGroupItem
          id="cat-secondhand"
          value="secondhand"
          className="peer sr-only"
        />
        <div className={chipClass}>
          Alat Secondhand
          {!isLoading && (
            <span className="text-xs opacity-75 font-normal">
              ({getCount("secondhand")})
            </span>
          )}
        </div>
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
          Favorit Saya
        </div>
      </label>
    </RadioGroup>
  );
}

"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const categories = [
  {
    value: "all",
    label: "Semua",
  },
  {
    value: "agricultural-waste",
    label: "Limbah Pertanian",
  },
  {
    value: "processed-product",
    label: "Produk Olahan",
  },
  {
    value: "secondhand",
    label: "Alat Secondhand",
  },
];

const chipClass = cn(
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border",
  "bg-background px-5 text-sm font-medium text-foreground",
  "transition-all duration-300 ease-in-out",
  "hover:border-primary",
  "hover:bg-primary/5",
  "hover:text-primary",
  "hover:shadow-md",
  "peer-data-[state=checked]:border-primary",
  "peer-data-[state=checked]:bg-primary",
  "peer-data-[state=checked]:text-primary-foreground",
  "peer-data-[state=checked]:shadow-md",
);

export default function CategoryFilter() {
  return (
    <RadioGroup
      defaultValue="all"
      className="flex flex-nowrap lg:flex-wrap items-center gap-3"
    >
      {categories.map((category) => (
        <label
          key={category.value}
          htmlFor={category.value}
          className="flex cursor-pointer"
        >
          <RadioGroupItem
            id={category.value}
            value={category.value}
            className="peer sr-only"
          />

          <div className={chipClass}>{category.label}</div>
        </label>
      ))}
    </RadioGroup>
  );
}

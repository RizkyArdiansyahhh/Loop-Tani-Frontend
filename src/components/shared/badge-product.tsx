"use client";

import { Badge } from "@/components/ui/badge";
import { Hammer, Leaf, Wheat } from "lucide-react";
import clsx from "clsx";

export type ProductCategory =
  | "agricultural-waste"
  | "processed-product"
  | "secondhand";

interface BadgeProductProps {
  category: ProductCategory;
  className?: string;
}

const badgeConfig = {
  "agricultural-waste": {
    label: "Limbah Pertanian",
    icon: Wheat,
    className:
      // Menggunakan background putih 95% dengan bayangan agar terpisah dari gambar
      "bg-white/95 text-amber-700 border-amber-300 shadow-md hover:bg-white dark:bg-black/90 dark:text-amber-500 dark:border-amber-900/50",
  },

  "processed-product": {
    label: "Produk Olahan",
    icon: Leaf,
    className:
      "bg-white/95 text-green-700 border-green-300 shadow-md hover:bg-white dark:bg-black/90 dark:text-green-500 dark:border-green-900/50",
  },

  secondhand: {
    label: "Alat Secondhand",
    icon: Hammer,
    className:
      "bg-white/95 text-blue-700 border-blue-300 shadow-md hover:bg-white dark:bg-black/90 dark:text-blue-500 dark:border-blue-900/50",
  },
};

const BadgeProduct = ({ category, className }: BadgeProductProps) => {
  const config = badgeConfig[category];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={clsx(
        "absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md transition-colors duration-300",
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};

export default BadgeProduct;

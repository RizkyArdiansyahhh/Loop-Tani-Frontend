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
      "bg-secondary/20 text-secondary-foreground border-secondary/40 hover:bg-secondary/30",
  },

  "processed-product": {
    label: "Produk Olahan",
    icon: Leaf,
    className:
      "bg-primary/10 text-primary border-primary/25 hover:bg-primary/15",
  },

  secondhand: {
    label: "Alat Secondhand",
    icon: Hammer,
    className: "bg-accent/15 text-accent border-accent/30 hover:bg-accent/25",
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

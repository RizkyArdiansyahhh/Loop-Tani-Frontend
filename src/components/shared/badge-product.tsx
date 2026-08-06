"use client";

import { useTranslations } from "next-intl";
import { getCategoryKey } from "@/constants/category-map";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import clsx from "clsx";

interface BadgeProductProps {
  category: string;
  className?: string;
}

const BadgeProduct = ({ category, className }: BadgeProductProps) => {
  const t = useTranslations("product.categories");
  const categoryKey = getCategoryKey(category);
  const label = categoryKey ? t(categoryKey) : category;

  return (
    <div className="absolute left-3 top-3 z-30">
      <LiquidGlassCard
        draggable={false}
        expandable={false}
        blurIntensity="lg"
        shadowIntensity="sm"
        glowIntensity="xs"
        borderRadius="9999px"
        className={clsx(
          "inline-flex items-center justify-center px-3.5 py-1 text-xs font-bold tracking-wide text-foreground bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/20 select-none shadow-sm",
          className
        )}
      >
        <span className="relative z-30 text-gray-900 dark:text-white">
          {label}
        </span>
      </LiquidGlassCard>
    </div>
  );
};

export default BadgeProduct;

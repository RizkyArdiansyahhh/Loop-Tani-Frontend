"use client";

import { useTranslations } from "next-intl";
import type { CalculationResult } from "../lib/dummy-data";

interface AiInsightProps {
  result: CalculationResult;
}

const AiInsight = ({ result }: AiInsightProps) => {
  const t = useTranslations("fertilizer");

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-850/50">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {t("insights.title")}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {result.insights.map((key, idx) => (
          <div
            key={key}
            className="flex items-start gap-2.5 rounded-xl border border-gray-200/60 bg-white p-3 shadow-2xs dark:border-gray-700/60 dark:bg-gray-900/60"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {idx + 1}
            </span>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {t(`insights.${key}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInsight;

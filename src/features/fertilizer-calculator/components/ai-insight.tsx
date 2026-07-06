"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, Sparkles } from "lucide-react";
import type { CalculationResult } from "../lib/dummy-data";

interface AiInsightProps {
  result: CalculationResult;
}

const AiInsight = ({ result }: AiInsightProps) => {
  const t = useTranslations("fertilizer");

  return (
    <div className="mx-auto mt-8 max-w-4xl px-4">
      <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-sm">
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-accent/10 blur-[80px]" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {t("insights.title")}
            </h3>
          </div>

          {/* Tips grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.insights.map((key) => (
              <div
                key={key}
                className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/20 p-4 transition-all hover:border-primary/20 hover:bg-primary/5"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`insights.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsight;

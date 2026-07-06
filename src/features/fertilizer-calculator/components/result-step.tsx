"use client";

import { useTranslations } from "next-intl";
import {
  Leaf,
  FlaskConical,
  Coins,
  RotateCcw,
  TrendingUp,
  CircleCheck,
} from "lucide-react";
import type { CalculationResult } from "../lib/dummy-data";
import { formatRupiah } from "../lib/dummy-data";

interface ResultStepProps {
  result: CalculationResult;
  onReset: () => void;
}

const nutrientColors: Record<string, string> = {
  nitrogen: "bg-primary",
  phosphorus: "bg-secondary",
  potassium: "bg-accent",
};

const ResultStep = ({ result, onReset }: ResultStepProps) => {
  const t = useTranslations("fertilizer");

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {t("result.recommendedNutrients")}
          </h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("result.reset")}
        </button>
      </div>

      {/* 3-Column Dashboard */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Nutrients */}
        <div className="rounded-2xl border border-border/40 bg-background/60 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t("result.recommendedNutrients")}
            </h3>
          </div>
          <div className="space-y-4">
            {result.nutrients.map((n) => (
              <div key={n.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t(`result.${n.name}`)}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {n.amount} {n.unit}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${nutrientColors[n.name] || "bg-primary"} transition-all duration-1000`}
                    style={{ width: `${n.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Fertilizers */}
        <div className="rounded-2xl border border-border/40 bg-background/60 p-5">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t("result.recommendedFertilizers")}
            </h3>
          </div>
          <div className="space-y-3">
            {result.fertilizers.map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 px-3 py-2"
              >
                <span className="text-sm text-foreground">{f.name}</span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {f.amount} {f.unit}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">
                {t("result.estimatedCost")}
              </span>
            </div>
            <span className="text-sm font-bold text-accent">
              {formatRupiah(result.estimatedCost)}
            </span>
          </div>
        </div>

        {/* Card 3: AI Confidence */}
        <div className="rounded-2xl border border-border/40 bg-background/60 p-5 md:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {t("result.aiConfidence")}
            </h3>
          </div>

          {/* Accuracy ring */}
          <div className="mb-4 flex justify-center">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.confidence / 100) * 264} 264`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">
                  {result.confidence}%
                </span>
              </div>
            </div>
          </div>

          <p className="mb-1 text-center text-xs font-medium text-muted-foreground">
            {t("result.accuracy")}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-secondary/30 px-3 py-2">
            <CircleCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {t("result.status")}: {t("result.optimal")}
            </span>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("result.suitable")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultStep;

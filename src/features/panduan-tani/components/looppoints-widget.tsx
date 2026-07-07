"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Award, ShoppingBag, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LoopPointsWidgetProps {
  points: number;
  onRedeem: (cost: number, rewardName: string) => void;
}

export function LoopPointsWidget({ points, onRedeem }: LoopPointsWidgetProps) {
  const t = useTranslations("panduan");
  const [animatedPoints, setAnimatedPoints] = useState(points);

  // Animate points counter when it changes
  useEffect(() => {
    if (points === animatedPoints) return;
    const diff = points - animatedPoints;
    const duration = 800; // ms
    const stepTime = Math.max(Math.floor(duration / Math.abs(diff)), 20);
    
    let current = animatedPoints;
    const timer = setInterval(() => {
      if (diff > 0) {
        current += 1;
        if (current >= points) {
          current = points;
          clearInterval(timer);
        }
      } else {
        current -= 1;
        if (current <= points) {
          current = points;
          clearInterval(timer);
        }
      }
      setAnimatedPoints(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, [points, animatedPoints]);

  // Determine tier & progress
  let currentTier = "Bronze";
  let nextTier = "Silver";
  let minPointsForCurrent = 0;
  let maxPointsForCurrent = 300;

  if (points >= 300 && points < 1000) {
    currentTier = "Silver";
    nextTier = "Gold";
    minPointsForCurrent = 300;
    maxPointsForCurrent = 1000;
  } else if (points >= 1000) {
    currentTier = "Gold";
    nextTier = "Platinum";
    minPointsForCurrent = 1000;
    maxPointsForCurrent = 2500;
  }

  const range = maxPointsForCurrent - minPointsForCurrent;
  const progress = Math.min(
    Math.max(((points - minPointsForCurrent) / range) * 100, 0),
    100
  );
  const remaining = Math.max(maxPointsForCurrent - points, 0);

  const handleRedeemClick = (cost: number, optionKey: string) => {
    const rewardTitle = t(`redeemPoints.${optionKey}Title`);
    if (points >= cost) {
      onRedeem(cost, rewardTitle);
    } else {
      toast.error(t("redeemPoints.insufficient"), {
        description: `Butuh ${cost - points} poin lagi untuk menukarkan voucher ini.`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Wallet / Point Balance Highlight - Pulsing Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-emerald-600 via-primary to-emerald-950 p-6 text-white shadow-xl dark:shadow-emerald-950/20 col-span-1 lg:col-span-1 flex flex-col justify-between min-h-[220px]">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-yellow-400/25 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-100/90 tracking-wide uppercase">
              {t("pointsBalance")}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs text-yellow-300">
              <Sparkles className="h-5 w-5 fill-current animate-pulse" />
            </div>
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-fraunces text-5xl font-bold tracking-tight text-white drop-shadow-xs">
              {animatedPoints}
            </span>
            <span className="text-lg font-medium text-emerald-200">LP</span>
          </div>
        </div>

        {/* Tier status indicator */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white/20",
              currentTier === "Gold" ? "bg-amber-400 text-gray-900" :
              currentTier === "Silver" ? "bg-slate-300 text-gray-900" :
              "bg-amber-700 text-white"
            )}>
              {currentTier[0]}
            </div>
            <div>
              <p className="text-2xs text-emerald-200 leading-none">Tier Akun</p>
              <p className="text-xs font-bold text-white">{currentTier} Partner</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-3xs font-semibold text-emerald-100 hover:bg-white/20 cursor-pointer transition-colors">
            Loyalty Hub <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Tier Progress Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 col-span-1 lg:col-span-1 flex flex-col justify-between min-h-[220px]">
        <div>
          <div className="flex items-center gap-2.5 text-gray-900 dark:text-gray-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="font-fraunces text-base font-bold">
              Progress & Target Reward
            </h4>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600 dark:text-gray-400">
                {t("tierProgress", { current: currentTier, next: nextTier })}
              </span>
              <span className="font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            
            {/* Custom progress bar */}
            <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          {remaining > 0 ? (
            <p className="leading-normal">
              🌟 {t("pointsToNext", { points: remaining, next: nextTier })}.
            </p>
          ) : (
            <p className="leading-normal flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Anda berada di Tier Tertinggi!
            </p>
          )}
        </div>
      </div>

      {/* Quick Redeem Cards - Points shop options */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 col-span-1 lg:col-span-1 flex flex-col justify-between min-h-[220px]">
        <div className="flex items-center gap-2.5 text-gray-900 dark:text-gray-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <h4 className="font-fraunces text-base font-bold">
            {t("redeemPoints.title")}
          </h4>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* Option 1: Commission discount */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                {t("redeemPoints.option1Title")}
              </span>
              <span className="text-4xs text-muted-foreground leading-tight">
                {t("redeemPoints.option1Desc")}
              </span>
            </div>
            <Button
              size="xs"
              onClick={() => handleRedeemClick(500, "option1")}
              disabled={points < 500}
              className={cn(
                "shrink-0 h-7 text-3xs font-bold px-2.5",
                points >= 500
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
              )}
            >
              500 LP
            </Button>
          </div>

          {/* Option 2: Voucher 20k */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                {t("redeemPoints.option2Title")}
              </span>
              <span className="text-4xs text-muted-foreground leading-tight">
                {t("redeemPoints.option2Desc")}
              </span>
            </div>
            <Button
              size="xs"
              onClick={() => handleRedeemClick(800, "option2")}
              disabled={points < 800}
              className={cn(
                "shrink-0 h-7 text-3xs font-bold px-2.5",
                points >= 800
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
              )}
            >
              800 LP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

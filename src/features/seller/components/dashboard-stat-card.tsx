"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: DashboardStatCardProps) {
  const isPositive = trend ? trend.value >= 0 : true;

  return (
    <Card className={cn(
      "relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 group",
      className
    )}>
      {/* Background soft aura light */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <CardContent className="p-5 space-y-4">
        {/* Header: Title & Icon */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Icon className="w-4.5 h-4.5 shrink-0" />
          </div>
        </div>

        {/* Body: Value & Trend */}
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>

          {(description || trend) && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold border",
                    isPositive 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400" 
                      : "bg-red-50 border-red-100 text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                </span>
              )}
              {description && <span className="text-[10px]">{description}</span>}
              {trend && <span className="text-[10px] text-slate-400">{trend.label}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

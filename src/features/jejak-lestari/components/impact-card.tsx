"use client";

import React from "react";
import { Wind, Droplets, Zap, Trees, Lightbulb, ArrowUpRight } from "lucide-react";
import { SustainabilityTotals } from "../lib/dummy-data";

interface ImpactCardProps {
  totals: SustainabilityTotals;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(n);
}

interface CardDef {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  comparison: string;
  comparisonIcon: React.ElementType;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  subtextColor: string;
  pillBg: string;
  ring: string;
}

export function ImpactCard({ totals }: ImpactCardProps) {
  const cards: CardDef[] = [
    {
      icon: Wind,
      label: "Emisi Dicegah",
      value: formatNumber(totals.totalCo2Prevented),
      unit: "kg CO₂",
      comparison: `≈ ${totals.treesEquivalent} pohon ditanam`,
      comparisonIcon: Trees,
      cardBg: "bg-primary text-primary-foreground",
      iconBg: "bg-primary-foreground/15",
      iconColor: "text-primary-foreground",
      textColor: "text-primary-foreground",
      subtextColor: "text-primary-foreground/80",
      pillBg: "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/10",
      ring: "ring-primary/10",
    },
    {
      icon: Droplets,
      label: "Air Tanah Dilindungi",
      value: formatNumber(totals.totalWaterProtected),
      unit: "Liter",
      comparison: `≈ ${Math.round(totals.totalWaterProtected / 180)} sesi mandi`,
      comparisonIcon: Droplets,
      cardBg: "bg-secondary text-secondary-foreground border border-border/50",
      iconBg: "bg-secondary-foreground/10",
      iconColor: "text-secondary-foreground",
      textColor: "text-secondary-foreground",
      subtextColor: "text-secondary-foreground/85",
      pillBg: "bg-secondary-foreground/15 text-secondary-foreground border-secondary-foreground/10",
      ring: "ring-secondary/15",
    },
    {
      icon: Zap,
      label: "Energi Terbarukan",
      value: formatNumber(totals.totalEnergyGenerated),
      unit: "kWh",
      comparison: `≈ ${totals.electricityMonths} bln listrik rumah`,
      comparisonIcon: Lightbulb,
      cardBg: "bg-accent text-accent-foreground",
      iconBg: "bg-accent-foreground/15",
      iconColor: "text-accent-foreground",
      textColor: "text-accent-foreground",
      subtextColor: "text-accent-foreground/80",
      pillBg: "bg-accent-foreground/20 text-accent-foreground border-accent-foreground/10",
      ring: "ring-accent/10",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const CompIcon = card.comparisonIcon;
        return (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-3xl p-6 shadow-md ring-1 ${card.ring} ${card.cardBg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            {/* Top row: icon + arrow */}
            <div className="flex items-start justify-between mb-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} backdrop-blur-xs`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <ArrowUpRight className={`h-4 w-4 ${card.subtextColor}`} />
            </div>

            {/* Value */}
            <div className="mb-1">
              <span className={`text-4xl font-bold tracking-tight ${card.textColor}`}>
                {card.value}
              </span>
              <span className={`ml-2 text-sm font-medium ${card.subtextColor}`}>
                {card.unit}
              </span>
            </div>

            {/* Label */}
            <p className={`text-sm font-semibold mb-4 ${card.textColor}`}>
              {card.label}
            </p>

            {/* Contextual comparison pill */}
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${card.pillBg}`}>
              <CompIcon className="h-3 w-3 shrink-0" />
              {card.comparison}
            </div>

            {/* Decorative orb shapes (using white/black transparency instead of custom colors) */}
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5" />
          </div>
        );
      })}
    </div>
  );
}

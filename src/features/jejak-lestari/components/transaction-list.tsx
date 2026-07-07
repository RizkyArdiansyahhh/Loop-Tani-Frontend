"use client";

import React, { useState } from "react";
import {
  Wind,
  Droplets,
  Zap,
  Package,
  ChevronDown,
  Leaf,
  Calendar,
  Hash,
} from "lucide-react";
import {
  TransactionImpact,
  categoryLabels,
  categoryColors,
} from "../lib/dummy-data";

interface TransactionListProps {
  transactions: TransactionImpact[];
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

function MetricBar({
  icon: Icon,
  value,
  unit,
  label,
  barColor,
  maxValue,
}: {
  icon: React.ElementType;
  value: number;
  unit: string;
  label: string;
  barColor: string;
  maxValue: number;
}) {
  const pct = Math.min(100, Math.round((value / maxValue) * 100));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-gray-500 font-medium">
          <Icon className="h-3 w-3 shrink-0" />
          {label}
        </span>
        <span className="font-bold text-gray-800 dark:text-gray-200">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: TransactionImpact }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 dark:bg-gray-900 ${
        expanded
          ? "border-emerald-200 shadow-md dark:border-emerald-800/40"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700"
      }`}
    >
      {/* Clickable main row */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left"
        aria-expanded={expanded}
        aria-label={`${transaction.productName} — ${expanded ? "tutup" : "lihat"} detail dampak`}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Left accent bar */}
          <div
            className={`h-12 w-1 shrink-0 rounded-full transition-colors ${
              expanded ? "bg-primary" : "bg-border group-hover:bg-primary/50"
            }`}
          />

          {/* Icon */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors ${
              expanded ? "bg-primary/10 dark:bg-primary/20" : "bg-muted/50 dark:bg-muted/10"
            }`}
          >
            <Package
              className={`h-4.5 w-4.5 ${
                expanded ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {transaction.productName}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                  categoryColors[transaction.productCategory]
                }`}
              >
                <Leaf className="h-2.5 w-2.5" />
                {categoryLabels[transaction.productCategory]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(transaction.date)}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {transaction.quantity} {transaction.unit}
              </span>
              <span className="font-medium text-gray-500">
                {formatPrice(transaction.totalPrice)}
              </span>
            </div>
          </div>

          {/* Summary pills (hidden on mobile, visible sm+) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-semibold text-primary">
              <Wind className="h-3 w-3" />
              {transaction.metrics.co2Prevented.toFixed(1)} kg CO₂
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary/20 border border-secondary/30 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              <Droplets className="h-3 w-3" />
              {transaction.metrics.waterProtected}L
            </span>
            <span className="flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-1 text-xs font-semibold text-accent">
              <Zap className="h-3 w-3" />
              {transaction.metrics.energyGenerated.toFixed(1)} kWh
            </span>
          </div>

          {/* Chevron */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all ${
              expanded
                ? "rotate-180 border-primary/30 bg-primary/10 text-primary"
                : "border-gray-100 bg-gray-50 text-gray-400"
            }`}
          >
            <ChevronDown className="h-4 w-4 transition-transform duration-300" />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-dashed border-primary/20 bg-linear-to-br from-primary/5 to-secondary/10 px-5 pb-5 pt-4 dark:border-primary-foreground/5 dark:from-primary/5 dark:to-secondary/5">
          {/* Impact description */}
          <div className="mb-4 flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Leaf className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {transaction.impactDescription}
            </p>
          </div>

          {/* Mini metric bars */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            <MetricBar
              icon={Wind}
              value={transaction.metrics.co2Prevented}
              unit="kg CO₂"
              label="Emisi Dicegah"
              barColor="bg-primary"
              maxValue={10}
            />
            <MetricBar
              icon={Droplets}
              value={transaction.metrics.waterProtected}
              unit="L"
              label="Air Dilindungi"
              barColor="bg-secondary"
              maxValue={600}
            />
            <MetricBar
              icon={Zap}
              value={transaction.metrics.energyGenerated}
              unit="kWh"
              label="Energi Dihasilkan"
              barColor="bg-accent"
              maxValue={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-16 dark:border-gray-800">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
          <Package className="h-6 w-6 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-400">
          Tidak ada transaksi untuk kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {transactions.map((txn) => (
        <TransactionRow key={txn.id} transaction={txn} />
      ))}
    </div>
  );
}

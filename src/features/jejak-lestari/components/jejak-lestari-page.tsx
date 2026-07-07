"use client";

import React, { useState, useMemo } from "react";
import { Sprout, ChevronDown, TrendingUp } from "lucide-react";
import { ImpactCard } from "./impact-card";
import { TransactionList } from "./transaction-list";
import { ExportPanel } from "./export-panel";
import {
  dummyTransactions,
  computeSustainabilityTotals,
  ImpactCategory,
  categoryLabels,
} from "../lib/dummy-data";

type FilterCategory = "semua" | ImpactCategory;

const CATEGORY_OPTIONS: { value: FilterCategory; label: string }[] = [
  { value: "semua", label: "Semua Kategori" },
  ...Object.entries(categoryLabels).map(([value, label]) => ({
    value: value as ImpactCategory,
    label,
  })),
];

export default function JejakLestariPage() {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("semua");

  const filteredTransactions = useMemo(() => {
    if (filterCategory === "semua") return dummyTransactions;
    return dummyTransactions.filter(
      (txn) => txn.productCategory === filterCategory
    );
  }, [filterCategory]);

  const allTotals = useMemo(
    () => computeSustainabilityTotals(dummyTransactions),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50/60 pb-28 dark:bg-gray-950">
      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900">
        {/* Gradient mesh background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-10 -left-10 h-48 w-48 rounded-full bg-secondary/15 blur-2xl" />
          <div className="absolute bottom-0 right-64 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 dark:border-primary/30 dark:bg-primary/20">
            <Sprout className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              LoopTani · Dampak Nyata
            </span>
          </div>

          {/* Title */}
          <h1 className="font-fraunces mb-3 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Jejak{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lestari
            </span>
          </h1>

          <p className="max-w-lg text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Setiap pembelian Anda meninggalkan jejak positif. Lihat akumulasi
            kontribusi nyata Anda untuk lingkungan dan bumi yang lebih sehat.
          </p>

          {/* Quick stat strip */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 dark:bg-primary/30">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Transaksi</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {allTotals.transactionCount} pembelian
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-gray-400">Pohon Setara</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {allTotals.treesEquivalent} pohon
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-gray-400">Km Berkendara Dihindari</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {allTotals.drivingKmAvoided} km
              </p>
            </div>
          </div>
        </div>

        {/* Bottom border separator */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl space-y-10 px-4 pt-10 sm:px-6">
        
        {/* ── Section 1: Impact Cards ─────────────────────────────────────────── */}
        <section aria-labelledby="section-impact-heading">
          <SectionHeader
            id="section-impact-heading"
            title="Akumulasi Dampak Lingkungan"
            subtitle={`Berdasarkan ${allTotals.transactionCount} transaksi yang tercatat`}
          />
          <ImpactCard totals={allTotals} />
        </section>

        {/* ── Section 2: Transaction History ─────────────────────────────────── */}
        <section aria-labelledby="section-history-heading">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              id="section-history-heading"
              title="Riwayat Transaksi & Dampak"
              subtitle="Klik baris untuk melihat detail dampak per transaksi."
              noMargin
            />

            {/* Filter select */}
            <div className="relative inline-flex items-center">
              <select
                id="filter-category"
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value as FilterCategory)
                }
                className="appearance-none h-9 rounded-xl border border-gray-200 bg-white pl-3.5 pr-9 text-xs font-semibold text-gray-700 shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <TransactionList transactions={filteredTransactions} />
        </section>

        {/* ── Section 3: Export ──────────────────────────────────────────────── */}
        <section aria-labelledby="section-export-heading">
          <h2 id="section-export-heading" className="sr-only">
            Ekspor Laporan
          </h2>
          <ExportPanel totals={allTotals} />
        </section>
      </div>
    </div>
  );
}

// ─── Helper component ─────────────────────────────────────────────────────────

function SectionHeader({
  id,
  title,
  subtitle,
  noMargin = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  noMargin?: boolean;
}) {
  return (
    <div className={noMargin ? "" : "mb-4"}>
      <h2 id={id} className="text-base font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

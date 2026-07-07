"use client";

import React from "react";
import { FileText, Sheet, ArrowDownToLine, BadgeCheck } from "lucide-react";
import { SustainabilityTotals } from "../lib/dummy-data";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface ExportPanelProps {
  totals: SustainabilityTotals;
}

// ─── Export Handlers ──────────────────────────────────────────────────────────

function handleExportPDF(totals: SustainabilityTotals) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text("Laporan Jejak Lestari — LoopTani", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}`, 14, 30);

  doc.setDrawColor(229, 231, 235);
  doc.line(14, 34, 196, 34);

  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Ringkasan Dampak Lingkungan", 14, 44);

  const rows = [
    ["Total Emisi CO₂ Dicegah", `${totals.totalCo2Prevented.toFixed(1)} kg`],
    ["Air Tanah Dilindungi", `${totals.totalWaterProtected.toLocaleString("id-ID")} Liter`],
    ["Energi Terbarukan Dihasilkan", `${totals.totalEnergyGenerated.toFixed(1)} kWh`],
    ["Setara Pohon Ditanam", `${totals.treesEquivalent} pohon`],
    ["Jarak Berkendara Dihindari", `${totals.drivingKmAvoided} km`],
    ["Total Transaksi", `${totals.transactionCount} transaksi`],
  ];

  let y = 52;
  rows.forEach(([label, value], i) => {
    if (i % 2 === 0) doc.setFillColor(249, 250, 251);
    else doc.setFillColor(255, 255, 255);
    doc.rect(14, y - 4, 182, 9, "F");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(label, 18, y + 1);
    doc.setTextColor(16, 185, 129);
    doc.text(value, 140, y + 1);
    y += 11;
  });

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text("Data dihitung berdasarkan faktor emisi SNI & IPCC 2023 · LoopTani Platform", 14, 285);

  doc.save("jejak-lestari-report.pdf");
}

function handleExportExcel(totals: SustainabilityTotals) {
  const data = [
    { Metrik: "Total Emisi CO₂ Dicegah", Nilai: totals.totalCo2Prevented, Satuan: "kg" },
    { Metrik: "Air Tanah Dilindungi", Nilai: totals.totalWaterProtected, Satuan: "Liter" },
    { Metrik: "Energi Terbarukan Dihasilkan", Nilai: totals.totalEnergyGenerated, Satuan: "kWh" },
    { Metrik: "Setara Pohon Ditanam", Nilai: totals.treesEquivalent, Satuan: "Pohon" },
    { Metrik: "Jarak Berkendara Dihindari", Nilai: totals.drivingKmAvoided, Satuan: "km" },
    { Metrik: "Total Transaksi", Nilai: totals.transactionCount, Satuan: "Transaksi" },
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Jejak Lestari");
  XLSX.writeFile(wb, "jejak-lestari-report.xlsx");
}

// ─── Component ────────────────────────────────────────────────────────────────

interface UseCase {
  icon: string;
  label: string;
}

const USE_CASES: UseCase[] = [
  { icon: "🏢", label: "Laporan CSR Perusahaan" },
  { icon: "🌿", label: "Aplikasi Hibah Lingkungan" },
  { icon: "📊", label: "Pelaporan ESG Investor" },
];

export function ExportPanel({ totals }: ExportPanelProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* Top banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 px-7 py-6">
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Ekspor Laporan
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Laporan Keberlanjutan Siap Unduh
          </h2>
          <p className="text-sm text-gray-400 max-w-md">
            Dokumentasi dampak lingkungan Anda dalam format profesional untuk
            keperluan pelaporan eksternal.
          </p>
        </div>

        {/* Use case badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <span
              key={uc.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-300"
            >
              <span>{uc.icon}</span>
              {uc.label}
            </span>
          ))}
        </div>

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-20 w-20 rounded-full bg-secondary/10 blur-xl" />
      </div>

      {/* Body */}
      <div className="p-7">
        {/* Stats snapshot */}
        <div className="mb-6 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-gray-50/70 dark:bg-gray-800/50 dark:border-gray-800 dark:divide-gray-800">
          {[
            { value: totals.totalCo2Prevented.toFixed(1), label: "kg CO₂" },
            { value: totals.totalWaterProtected.toLocaleString("id-ID"), label: "Liter Air" },
            { value: totals.totalEnergyGenerated.toFixed(1), label: "kWh Energi" },
          ].map((stat) => (
            <div key={stat.label} className="py-4 text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="btn-export-pdf"
            onClick={() => handleExportPDF(totals)}
            className="group flex flex-1 items-center justify-between gap-3 rounded-2xl border border-border bg-white px-5 py-4 text-left shadow-xs transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:shadow-md active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-destructive/40 dark:hover:bg-destructive/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20 group-hover:bg-destructive/20 dark:bg-destructive/30 dark:border-destructive/40 transition-colors">
                <FileText className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Ekspor ke PDF
                </p>
                <p className="text-xs text-gray-400">Laporan siap cetak</p>
              </div>
            </div>
            <ArrowDownToLine className="h-4 w-4 text-gray-300 group-hover:text-destructive transition-colors" />
          </button>

          <button
            id="btn-export-excel"
            onClick={() => handleExportExcel(totals)}
            className="group flex flex-1 items-center justify-between gap-3 rounded-2xl border border-border bg-white px-5 py-4 text-left shadow-xs transition-all hover:border-primary/30 hover:bg-primary/10 hover:shadow-md active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/45 dark:hover:bg-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 dark:bg-primary/30 dark:border-primary/40 transition-colors">
                <Sheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Ekspor ke Excel
                </p>
                <p className="text-xs text-gray-400">Data tabel lengkap</p>
              </div>
            </div>
            <ArrowDownToLine className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Certification note */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3">
          <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs text-gray-500">
            Mencakup <span className="font-semibold text-gray-700 dark:text-gray-300">{totals.transactionCount} transaksi</span> · Dihitung berdasarkan faktor emisi{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">SNI &amp; IPCC 2023</span>
          </p>
        </div>
      </div>
    </div>
  );
}

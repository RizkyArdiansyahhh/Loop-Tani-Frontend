"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  Coins,
  CircleCheck,
  RotateCcw,
  Target,
  Layers,
  Trees,
  TrendingUp,
  Brain,
  ArrowRight,
  Copy,
  Check,
  Printer,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { CalculationResult } from "../lib/dummy-data";
import {
  formatRupiah,
  getSackEstimate,
  cropNames,
  soilDetails,
  stageDetails,
} from "../lib/dummy-data";

interface ResultStepProps {
  result: CalculationResult;
  onReset: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const nutrientColors: Record<string, string> = {
  nitrogen: "bg-emerald-500",
  phosphorus: "bg-amber-500",
  potassium: "bg-blue-500",
};

const accentStyles = {
  emerald: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20",
  blue: "from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-500/20",
  amber: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20",
  purple: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20",
  teal: "from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-500/20",
};

const DetailCard = ({
  icon: Icon,
  label,
  value,
  accent = "emerald",
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  accent?: keyof typeof accentStyles;
}) => (
  <div
    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-2xs hover:border-primary/30 transition-all min-w-0 max-w-full overflow-hidden"
    title={value}
  >
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br border ${accentStyles[accent]}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
      <span className="text-[11px] font-medium text-muted-foreground truncate">{label}</span>
      <span className="text-xs font-bold text-foreground mt-0.5 line-clamp-2 leading-tight break-words" title={value}>
        {value}
      </span>
    </div>
  </div>
);

const ResultStep = ({ result, onReset }: ResultStepProps) => {
  const t = useTranslations("fertilizer");
  const [copied, setCopied] = useState(false);

  // Extract fertilizers
  const ureaItem = result.fertilizers.find((f) => f.name.toLowerCase().includes("urea"));
  const sp36Item = result.fertilizers.find((f) => f.name.toLowerCase().includes("sp-36") || f.name.toLowerCase().includes("sp36"));
  const kclItem = result.fertilizers.find((f) => f.name.toLowerCase().includes("kcl"));

  const ureaTotal = ureaItem?.amount || 0;
  const sp36Total = sp36Item?.amount || 0;
  const kclTotal = kclItem?.amount || 0;

  // Farm input metadata
  const input = result.inputData || {
    cropType: "rice",
    landSize: "1",
    unit: "Hektar" as const,
    soilType: "clay",
    growthStage: "vegetative",
  };

  const cropTitle = cropNames[input.cropType] || input.cropType;
  const soilInfo = soilDetails[input.soilType];
  const stageInfo = stageDetails[input.growthStage];

  // 3-Stage Fertilizer Application Schedule (Standar Balittanah / Kementan RI)
  const scheduleStages = [
    {
      stageNumber: 1,
      title: "Pemupukan Dasar",
      timing: "0 - 7 HST (Saat Olah Tanah)",
      purpose: "Merangsang perakaran awal & daya adaptasi benih/bibit.",
      dosageDetails: [
        { name: "SP-36", amount: Math.round(sp36Total * 1.0), unit: "kg (100%)" },
        { name: "Urea", amount: Math.round(ureaTotal * 0.3), unit: "kg (30%)" },
        { name: "KCl", amount: Math.round(kclTotal * 0.25), unit: "kg (25%)" },
      ].filter((d) => d.amount > 0),
      note: "Benamkan sedalam 5-10 cm atau ratakan saat pelumpuran tanah terakhir.",
    },
    {
      stageNumber: 2,
      title: "Pemupukan Susulan I",
      timing: "20 - 25 HST (Awal Vegetatif)",
      purpose: "Memperbanyak anakan produktif, pembentukan batang, & biomassa.",
      dosageDetails: [
        { name: "Urea", amount: Math.round(ureaTotal * 0.4), unit: "kg (40%)" },
        { name: "KCl", amount: Math.round(kclTotal * 0.35), unit: "kg (35%)" },
      ].filter((d) => d.amount > 0),
      note: "Taburkan saat tanah lembap untuk menghindari penguapan amonia.",
    },
    {
      stageNumber: 3,
      title: "Pemupukan Susulan II",
      timing: "40 - 45 HST (Primordia / Bunga)",
      purpose: "Pengisian bulir / pembesaran buah maksimal serta memperkokoh tegakan.",
      dosageDetails: [
        { name: "Urea", amount: Math.round(ureaTotal * 0.3), unit: "kg (30%)" },
        { name: "KCl", amount: Math.round(kclTotal * 0.4), unit: "kg (40%)" },
      ].filter((d) => d.amount > 0),
      note: "Pastikan ketersediaan air cukup sebelum pemupukan agar serapan optimal.",
    },
  ];

  const handleCopy = () => {
    const summary = `REKOMENDASI DOSIS PUPUK PRESISI - LOOPTANI
===========================================
Komoditas: ${cropTitle}
Luas Lahan: ${input.landSize} ${input.unit}
Tanah: ${soilInfo?.title || input.soilType} | Fase: ${stageInfo?.title || input.growthStage}

Kebutuhan Nutrisi Murni (N-P-K):
${result.nutrients.map((n) => `• ${n.name.toUpperCase()}: ${n.amount} ${n.unit} (${n.percentage}%)`).join("\n")}

Kebutuhan Pupuk Tunggal:
${result.fertilizers.map((f) => `• ${f.name}: ${f.amount} ${f.unit} (${getSackEstimate(f.amount)})`).join("\n")}

Estimasi Total Biaya: ${formatRupiah(result.estimatedCost)}
Tingkat Akurasi AI: ${result.confidence}% (Formula Optimal)
Rujukan: ${result.recommendationSource.dosage}

Jadwal Aplikasi 3 Tahap:
1. Pemupukan Dasar (0-7 HST): 100% SP-36, 30% Urea, 25% KCl
2. Susulan I (20-25 HST): 40% Urea, 35% KCl
3. Susulan II (40-45 HST): 30% Urea, 40% KCl
===========================================
Dihitung otomatis melalui LoopTani Smart Fertilizer Calculator`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success("Rincian rekomendasi berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden"
      >
        {/* ── LEFT — Technical Analysis Details (65%) ───────────────── */}
        <div className="flex flex-1 flex-col border-border/40 p-6 sm:p-8 lg:border-r lg:p-10 min-w-0 max-w-full overflow-x-hidden">
          {/* Hero Header Banner (Mirip Limbah Analyzer) */}
          <motion.div variants={itemVariants} className="mb-8 w-full max-w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5 p-5 shadow-2xs min-w-0 max-w-full overflow-x-hidden">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
                  <Leaf className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1.5 min-w-0 max-w-full overflow-x-hidden">
                <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
                  <h3 className="font-fraunces text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words min-w-0 max-w-full">
                    {cropTitle} ({input.landSize} {input.unit})
                  </h3>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1 min-w-0 max-w-full">
                  <span className="font-semibold text-primary break-words min-w-0 max-w-full">
                    {stageInfo?.title || input.growthStage}
                  </span>
                  <span>·</span>
                  <span>{soilInfo?.title || input.soilType}</span>
                </p>

                <div className="mt-1 flex flex-wrap gap-2 max-w-full">
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold px-2.5 py-0.5 shadow-2xs">
                    {result.confidence}% {t("result.aiConfidence")}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium">
                    Formula Berimbang
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center font-medium">
                    Acuan: Balittanah
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Agronomic AI Notes / Summary Banner */}
          {result.insights && result.insights.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-4.5 shadow-2xs min-w-0 max-w-full overflow-x-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Panduan & Catatan Agronomi Khusus
                </p>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                {result.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Key Attributes Grid (DetailCard Mirip Limbah Analyzer) */}
          <motion.div variants={itemVariants} className="space-y-3 min-w-0 max-w-full">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Atribut Parameter Perhitungan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
              <DetailCard
                icon={Leaf}
                label="Jenis Tanaman"
                value={cropTitle}
                accent="emerald"
              />
              <DetailCard
                icon={Layers}
                label="Luas Lahan"
                value={`${input.landSize} ${input.unit}`}
                accent="blue"
              />
              <DetailCard
                icon={Trees}
                label="Jenis Tanah"
                value={`${soilInfo?.title || input.soilType} (${soilInfo?.shortDesc || "Standard"})`}
                accent="amber"
              />
              <DetailCard
                icon={TrendingUp}
                label="Fase Pertumbuhan"
                value={`${stageInfo?.title || input.growthStage} (${stageInfo?.timeline || "Aktif"})`}
                accent="purple"
              />
              <DetailCard
                icon={Target}
                label="Proporsi Nutrisi (N-P-K)"
                value={result.nutrients.map((n) => `${n.amount}kg ${n.name[0].toUpperCase()}`).join(" · ")}
                accent="teal"
              />
              <DetailCard
                icon={CircleCheck}
                label="Rujukan Acuan Dosis"
                value={result.recommendationSource.dosage}
                accent="emerald"
              />
            </div>
          </motion.div>

          {/* Nutrisi Murni (N-P-K) Horizontal Distribution Bars */}
          <motion.div variants={itemVariants} className="mt-8 min-w-0 max-w-full">
            <div className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-850/50">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">
                  Kebutuhan Hara Murni (N-P-K)
                </h4>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Proporsi Serapan
                </span>
              </div>

              <div className="space-y-3.5">
                {result.nutrients.map((n) => (
                  <div key={n.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground capitalize">
                        {n.name === "nitrogen" ? "Nitrogen (N)" : n.name === "phosphorus" ? "Fosfor (P₂O₅)" : "Kalium (K₂O)"}
                      </span>
                      <span className="font-bold text-foreground">
                        {n.amount} {n.unit} ({n.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${nutrientColors[n.name] || "bg-primary"} transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(10, n.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3-Stage Fertilizer Application Schedule */}
          <motion.div variants={itemVariants} className="mt-8 min-w-0 max-w-full">
            <div className="mb-3.5 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Jadwal Aplikasi Pemupukan Terbagi (3 Tahap)
              </p>
            </div>

            <div className="space-y-3">
              {scheduleStages.map((st) => (
                <div
                  key={st.stageNumber}
                  className="rounded-2xl border border-border/60 bg-card p-4 shadow-2xs hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      Tahap {st.stageNumber}: {st.title}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {st.timing}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 mb-2.5 leading-snug">
                    {st.purpose}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {st.dosageDetails.map((d) => (
                      <span
                        key={d.name}
                        className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 text-xs font-semibold text-foreground"
                      >
                        {d.name}: <strong className="text-primary">{d.amount} {d.unit}</strong>
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-muted-foreground italic">
                    💡 {st.note}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Toolbar Buttons */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-border/40 pt-5">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Tersalin" : "Salin Ringkasan"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Hasil</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-all cursor-pointer ml-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Hitung Tanaman Lain</span>
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT — Premium Cost & Fertilizer Sacks Card (35%) ────── */}
        <div className="flex flex-col bg-gradient-to-b from-primary/10 via-primary/5 to-muted/30 p-6 sm:p-8 lg:w-[35%] lg:p-10 border-t lg:border-t-0 border-border/40 min-w-0 max-w-full overflow-x-hidden shrink-0">
          <div className="mb-6 w-full max-w-full">
            <Badge className="bg-primary/15 text-primary border border-primary/20 mb-2 font-medium">
              Estimasi Biaya & Kebutuhan Pupuk
            </Badge>
            <h2 className="font-fraunces text-xl font-bold text-foreground break-words">
              Estimasi Total Biaya Pupuk
            </h2>
            <p className="mt-1 text-xs text-muted-foreground break-words">
              Kalkulasi berbasis kebutuhan dosis fisik & harga pasaran
            </p>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-1 flex-col items-center justify-center text-center my-4 min-w-0 max-w-full overflow-x-hidden"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-lg shadow-primary/25 mb-4 shrink-0">
              <Coins className="h-8 w-8" />
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary break-words max-w-full text-center">
              {formatRupiah(result.estimatedCost)}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-2xs max-w-full text-center leading-normal break-words">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span className="break-words">Kebutuhan Pupuk Tunggal Siap Aplikasi</span>
            </div>

            {/* Sacks Breakdown Cards */}
            <div className="mt-5 w-full space-y-2 text-left">
              {result.fertilizers.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/90 p-3 shadow-2xs backdrop-blur-2xs"
                >
                  <div>
                    <span className="text-xs font-bold text-foreground block">{f.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {getSackEstimate(f.amount)}
                    </span>
                  </div>
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {f.amount} {f.unit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Primary CTA Button */}
          <motion.div variants={itemVariants} className="mt-6 w-full space-y-2.5">
            <Link
              href="/loopi"
              className="flex h-13 w-full items-center justify-center rounded-2xl text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.01] gap-2 cursor-pointer"
            >
              <span>Konsultasi ke Loopi Chat</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </motion.div>

          {/* AI Verification Note */}
          <div className="mt-5 rounded-2xl border border-primary/20 bg-card/70 p-4 backdrop-blur-2xs shadow-2xs w-full max-w-full overflow-x-hidden">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs font-bold text-primary truncate">
                Formula Terverifikasi Sesuai Acuan
              </p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground break-words">
              Dosis telah disesuaikan secara proporsional dengan kapasitas tanah ({soilInfo?.title || input.soilType}) dan fase tumbuh ({stageInfo?.title || input.growthStage}).
            </p>
          </div>

          {/* Matching Marketplace Products */}
          {result.marketplaceProducts && result.marketplaceProducts.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border/40">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Produk Pupuk Terkait di Marketplace
                </span>
                <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                {result.marketplaceProducts.slice(0, 2).map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/marketplace/${prod.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/80 p-2.5 hover:border-primary/40 transition-all text-left"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {prod.storeName}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0">
                      {formatRupiah(prod.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultStep;

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Coins,
  CircleCheck,
  Pencil,
  RotateCcw,
  Target,
  Layers,
  Palette,
  Trees,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Brain,
  ArrowRight,
  Recycle,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditWasteDialog from "./edit-waste-dialog";
import type { WasteAnalysisResult } from "../types";

interface ResultStepProps {
  result: WasteAnalysisResult;
  preview: string;
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

const ResultStep = ({ result, preview, onReset }: ResultStepProps) => {
  const t = useTranslations("analyzer");
  const locale = useLocale();
  const isEnglish = locale === "en";
  const router = useRouter();
  const [customWasteName, setCustomWasteName] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  const rawResult = result as any;

  // Derive response contract directly from props (no useEffect)
  const wasteIdentification = result?.wasteIdentification || {
    indonesianName:
      rawResult?.wasteType ||
      rawResult?.wasteAnalysis?.primaryWasteType ||
      rawResult?.detectedWaste?.[0]?.name ||
      "Limbah Pertanian",
    englishName: rawResult?.englishName || "Agricultural Waste",
    category:
      rawResult?.category ||
      rawResult?.wasteAnalysis?.categories?.[0] ||
      rawResult?.detectedWaste?.[0]?.category ||
      "Limbah Pertanian",
    confidenceScore:
      rawResult?.confidenceScore ??
      rawResult?.confidence ??
      rawResult?.detectedWaste?.[0]?.confidence ??
      0.95,
  };

  const visualCondition = result?.visualCondition || {
    color: rawResult?.color || "Alami",
    state:
      rawResult?.condition ||
      rawResult?.detectedWaste?.[0]?.visualCondition ||
      "Sedang",
    environment: rawResult?.environment || "Lahan Pertanian",
  };

  const economicEstimation = result?.economicEstimation || {
    potentialValue:
      rawResult?.economicPotential?.potentialValue ||
      rawResult?.economicPotential?.estimatedValue ||
      rawResult?.detectedWaste?.[0]?.estimatedEconomicValue ||
      rawResult?.economicPotential?.level ||
      "Rp 150.000 - Rp 350.000 / ton",
    marketOpportunity:
      rawResult?.economicPotential?.marketOpportunity ||
      rawResult?.economicPotential?.level ||
      "Tinggi (Permintaan Lokal)",
    notes:
      rawResult?.economicPotential?.notes ||
      rawResult?.economicPotential?.description ||
      rawResult?.economicPotential?.disclaimer ||
      "Potensi nilai ekonomi bergantung pada kadar air, kebersihan, dan pengolahan limbah.",
  };

  const processingPotential =
    result?.processingPotential?.length
      ? result.processingPotential
      : Array.isArray(rawResult?.wasteAnalysis?.processingPotential) && rawResult.wasteAnalysis.processingPotential.length
      ? rawResult.wasteAnalysis.processingPotential
      : Array.isArray(rawResult?.detectedWaste?.[0]?.potentialProcessing) && rawResult.detectedWaste[0].potentialProcessing.length
      ? rawResult.detectedWaste[0].potentialProcessing
      : Array.isArray(rawResult?.recommendations) && rawResult.recommendations.length
      ? rawResult.recommendations
      : [
          "Pengomposan secara aerobik/anaerobik untuk pupuk organik berkualitas",
          "Pemanfaatan sebagai pakan ternak (sapi/kambing) setelah pencacahan",
          "Bahan baku briket biomassa atau bahan bakar energi alternatif",
        ];

  const primaryName = isEnglish
    ? (customWasteName || wasteIdentification.englishName || wasteIdentification.indonesianName || "Agricultural Waste")
    : (customWasteName || wasteIdentification.indonesianName || "Limbah Pertanian");

  const secondaryName = isEnglish
    ? (wasteIdentification.indonesianName && wasteIdentification.indonesianName !== primaryName ? wasteIdentification.indonesianName : null)
    : (wasteIdentification.englishName && wasteIdentification.englishName !== primaryName ? wasteIdentification.englishName : null);

  const handleEditConfirm = (newType: string) => {
    setCustomWasteName(newType);
    setConfirmed(null);
  };

  const rawConfidence =
    wasteIdentification.confidenceScore ??
    rawResult?.confidenceScore ??
    rawResult?.confidence ??
    0.95;

  const confidencePercentage =
    rawConfidence <= 1
      ? Math.round(rawConfidence * 100)
      : Math.round(rawConfidence);

  const isLowConfidence = confidencePercentage < 60;

  const handleSellNow = () => {
    const wasteTitle = encodeURIComponent(primaryName);
    router.push(`/seller/products?title=${wasteTitle}`);
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      {/* Top Warning Banners if applicable */}
      <div className="p-3 sm:p-6 pb-0 space-y-2 sm:space-y-3 w-full max-w-full overflow-x-hidden">
        {!result?.isAgriculturalWaste && (
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-destructive/30 bg-destructive/10 p-2.5 sm:p-4 text-destructive shadow-sm w-full min-w-0">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium break-words">
              Foto ini belum teridentifikasi sebagai limbah pertanian.
            </p>
          </div>
        )}

        {!result?.isAnalyzable && (
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2.5 sm:p-4 text-amber-700 dark:text-amber-400 shadow-sm w-full min-w-0">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium break-words">
              Foto kurang jelas untuk dianalisis. Silakan ambil foto dengan pencahayaan dan fokus yang lebih baik.
            </p>
          </div>
        )}

        {isLowConfidence && result?.isAgriculturalWaste && result?.isAnalyzable && (
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2.5 sm:p-4 text-amber-700 dark:text-amber-400 shadow-sm w-full min-w-0">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium break-words">
              Hasil identifikasi memiliki tingkat keyakinan rendah ({confidencePercentage}%). Silakan periksa kembali hasil analisis.
            </p>
          </div>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden"
      >
        {/* LEFT — Analysis Details (65%) */}
        <div className="flex flex-1 flex-col border-border/40 p-3.5 sm:p-8 lg:border-r lg:p-10 min-w-0 max-w-full overflow-x-hidden">
          {/* Hero Header: Photo + Main Identification */}
          <motion.div variants={itemVariants} className="mb-4 sm:mb-8 w-full max-w-full">
            <div className="flex flex-row items-center gap-3 sm:gap-5 rounded-xl sm:rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5 p-3 sm:p-5 shadow-sm min-w-0 max-w-full overflow-x-hidden">
              <div className="relative shrink-0">
                <img
                  src={preview}
                  alt="Analyzed Waste"
                  className="h-16 w-16 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
                />
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Leaf className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1 min-w-0 max-w-full overflow-x-hidden">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0 max-w-full">
                  <h3 className="font-fraunces text-base sm:text-2xl font-bold tracking-tight text-foreground break-words min-w-0 max-w-full">
                    {primaryName}
                  </h3>
                  {secondaryName && (
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 sm:px-2 rounded-md break-words max-w-full shrink-0">
                      {secondaryName}
                    </span>
                  )}
                </div>

                <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 min-w-0 max-w-full">
                  <span className="font-semibold text-primary break-words min-w-0 max-w-full">{wasteIdentification.category}</span>
                </p>

                <div className="mt-0.5 sm:mt-1 flex flex-wrap gap-1.5 sm:gap-2 max-w-full">
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 shadow-2xs">
                    {confidencePercentage}% {t("result.confidence")}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-medium text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 max-w-full whitespace-normal text-left">
                    {visualCondition.state}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis Notes / Summary */}
          {economicEstimation.notes && (
            <motion.div
              variants={itemVariants}
              className="mb-4 sm:mb-8 rounded-xl sm:rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-3 sm:p-4.5 shadow-sm min-w-0 max-w-full overflow-x-hidden"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                  {t("result.notes")}
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug sm:leading-relaxed break-words">
                {economicEstimation.notes}
              </p>
            </motion.div>
          )}

          {/* Grid of Key Attributes */}
          <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3 min-w-0 max-w-full">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5 sm:mb-1">
              Atribut Hasil Identifikasi
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 min-w-0 max-w-full">
              <DetailCard
                icon={Leaf}
                label={t("result.wasteType")}
                value={primaryName}
                accent="emerald"
              />
              <DetailCard
                icon={Layers}
                label={t("result.category")}
                value={wasteIdentification.category}
                accent="blue"
              />
              <DetailCard
                icon={Target}
                label={t("result.state")}
                value={visualCondition.state}
                accent="amber"
              />
              <DetailCard
                icon={Palette}
                label={t("result.color")}
                value={visualCondition.color}
                accent="purple"
              />
              <DetailCard
                icon={Trees}
                label={t("result.environment")}
                value={visualCondition.environment}
                accent="teal"
              />
              <DetailCard
                icon={Target}
                label={t("result.confidence")}
                value={`${confidencePercentage}%`}
                accent="emerald"
              />
            </div>
          </motion.div>

          {/* Processing Potential */}
          {processingPotential && processingPotential.length > 0 && (
            <motion.div variants={itemVariants} className="mt-4 sm:mt-8 min-w-0 max-w-full">
              <div className="mb-2 sm:mb-3.5 flex items-center gap-1.5 sm:gap-2">
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Recycle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("result.processingPotential")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 min-w-0 max-w-full">
                {processingPotential.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="group rounded-lg sm:rounded-xl border border-border/60 bg-card p-2.5 sm:p-3.5 shadow-2xs hover:border-primary/40 hover:shadow-sm transition-all flex items-start gap-2 sm:gap-2.5 min-w-0 max-w-full overflow-hidden"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-[11px] sm:text-xs font-medium text-foreground leading-snug sm:leading-relaxed break-words min-w-0 flex-1">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Confirmation Box */}
          <motion.div variants={itemVariants} className="mt-4 sm:mt-8 min-w-0 max-w-full">
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3 sm:p-5 shadow-2xs min-w-0 max-w-full overflow-x-hidden">
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-foreground break-words">
                {t("result.confirmationTitle")}
              </p>
              {confirmed === null && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 shadow-2xs transition-all text-xs h-8 sm:h-9 px-2.5 sm:px-4"
                    onClick={() => setConfirmed(true)}
                  >
                    <CircleCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    {t("result.yes")}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border-border/80 text-muted-foreground hover:text-foreground shadow-2xs text-xs h-8 sm:h-9 px-2.5 sm:px-4"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    {t("result.editWasteType")}
                  </Button>
                </div>
              )}
              {confirmed === true && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold break-words"
                >
                  <CircleCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                  <span className="break-words">{t("result.confirmed", { type: primaryName })}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Analyze Another */}
          <motion.div variants={itemVariants} className="mt-2.5 sm:mt-4 w-full">
            <Button
              variant="ghost"
              className="w-full gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm h-8 sm:h-9 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              {t("result.analyzeAnother")}
            </Button>
          </motion.div>
        </div>

        {/* RIGHT — Premium Value & Market Opportunity Card (35%) */}
        <div className="flex flex-col bg-gradient-to-b from-primary/10 via-primary/5 to-muted/30 p-4 sm:p-8 lg:w-[35%] lg:p-10 border-t lg:border-t-0 border-border/40 min-w-0 max-w-full overflow-x-hidden shrink-0">
          <div className="mb-3 sm:mb-6 w-full max-w-full">
            <Badge className="bg-primary/15 text-primary border border-primary/20 mb-1.5 sm:mb-2 font-medium text-[10px] sm:text-xs">
              {t("result.economicPotential")}
            </Badge>
            <h2 className="font-fraunces text-base sm:text-xl font-bold text-foreground break-words">
              {t("result.estimatedMarketValue")}
            </h2>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground break-words">
              {t("result.aiEstimation")}
            </p>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-1 flex-col items-center justify-center text-center my-2 sm:my-4 min-w-0 max-w-full overflow-x-hidden"
          >
            <div className="relative flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-lg shadow-primary/25 mb-2.5 sm:mb-4 shrink-0">
              <Coins className="h-5 w-5 sm:h-8 sm:w-8" />
            </div>

            <p className="text-xl sm:text-3xl font-extrabold tracking-tight text-primary break-words max-w-full text-center">
              {economicEstimation.potentialValue || "Tidak dapat diestimasi"}
            </p>

            {economicEstimation.marketOpportunity && (
              <div className="mt-2.5 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-2xs max-w-full text-center leading-normal break-words">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span className="break-words">{t("result.marketOpportunity")}: {economicEstimation.marketOpportunity}</span>
              </div>
            )}

            <p className="mt-2.5 sm:mt-4 text-[10px] sm:text-xs leading-snug sm:leading-relaxed text-muted-foreground max-w-full w-full bg-card/60 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-border/40 break-words text-left sm:text-center">
              {economicEstimation.notes || t("result.disclaimer")}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-3 sm:mt-6 w-full">
            <Button
              className="h-10 sm:h-13 w-full rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg sm:shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.01] gap-1.5 sm:gap-2"
              onClick={handleSellNow}
            >
              <span className="truncate">{t("result.sellNow")}</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            </Button>
          </motion.div>

          <div className="mt-3 sm:mt-5 rounded-xl sm:rounded-2xl border border-primary/20 bg-card/70 p-3 sm:p-4 backdrop-blur-sm shadow-2xs w-full max-w-full overflow-x-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
              <p className="text-[11px] sm:text-xs font-bold text-primary truncate">
                {t("summary.aiTitle")}
              </p>
            </div>
            <p className="mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] leading-snug sm:leading-relaxed text-muted-foreground break-words">
              {t("result.analysisComplete", {
                confidence: confidencePercentage,
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <EditWasteDialog
        currentType={primaryName}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onConfirm={handleEditConfirm}
      />
    </div>
  );
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
    className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/60 bg-card p-2 sm:p-3.5 shadow-2xs hover:border-primary/30 transition-all min-w-0 max-w-full overflow-hidden"
    title={value}
  >
    <div
      className={`flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br border ${accentStyles[accent]}`}
    >
      <Icon className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
    </div>
    <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
      <span className="text-[9px] sm:text-[11px] font-medium text-muted-foreground truncate">{label}</span>
      <span className="text-[11px] sm:text-xs font-bold text-foreground mt-0.5 line-clamp-2 leading-tight break-words" title={value}>
        {value}
      </span>
    </div>
  </div>
);

export default ResultStep;

"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { FeatureGuideModal, type GuideStep } from "@/components/shared/feature-guide-modal";
import UploadStep from "./upload-step";
import LoadingStep from "./loading-step";
import ResultStep from "./result-step";
import { useAnalyzeWaste } from "../hooks/use-analyze-waste";
import type { WasteAnalysisResult } from "../types";

type Step = "upload" | "loading" | "result";

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const LIMBAH_GUIDE_STEPS: GuideStep[] = [
  {
    stepNumber: 1,
    title: "Siapkan Foto Limbah Pertanian",
    description:
      "Ambil foto sisa hasil panen atau limbah (misalnya jerami, sekam, tandan kosong sawit, ampas tebu, atau kotoran ternak) dengan pencahayaan terang dan objek terlihat fokus.",
    tip: "Hindari foto buram atau terlalu gelap agar AI dapat mendeteksi kondisi fisik limbah secara akurat.",
  },
  {
    stepNumber: 2,
    title: "Unggah Foto ke Sistem",
    description:
      "Tarik berkas foto atau klik tombol 'Pilih File' di kotak unggah. Format yang didukung: JPG, PNG, atau WEBP hingga ukuran 10MB.",
  },
  {
    stepNumber: 3,
    title: "Analisis Otomatis oleh AI",
    description:
      "AI LoopTani akan mengidentifikasi jenis limbah, tingkat kelembapan/pembusukan, serta merekomendasikan 3–5 opsi pemanfaatan produk bernilai tambah.",
  },
  {
    stepNumber: 4,
    title: "Cek Estimasi Harga & Jual",
    description:
      "Lihat taksiran harga pasar dan peluang serapan pembeli. Anda dapat langsung klik 'Jual Sekarang' untuk memasarkannya di marketplace LoopTani.",
  },
];

const LimbahAnalyzer = () => {
  const t = useTranslations("analyzer");
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Auto-open guide on first access
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("looptani_guide_limbah_analyzer");
      if (!dismissed) {
        setIsGuideOpen(true);
      }
    } catch {
      setIsGuideOpen(true);
    }
  }, []);

  const { mutate: analyze } = useAnalyzeWaste();

  const handleAnalyze = useCallback(
    (file: File) => {
      setApiError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setStep("loading");

      analyze(file, {
        onSuccess: (response) => {
          setResult(response.data);
          setStep("result");
        },
        onError: (err) => {
          console.error("Gemini Waste Vision analysis failed:", err);
          setApiError(
            "Analisis sedang mengalami gangguan. Silakan coba lagi."
          );
          setStep("upload");
        },
      });
    },
    [analyze]
  );

  const handleReset = useCallback(() => {
    setStep("upload");
    setResult(null);
    setPreview("");
    setApiError(null);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16 dark:bg-gray-950 font-poppins">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 sm:px-6 lg:px-8 sm:pt-6 sm:pb-3">
          <Breadcrumbs
            items={[
              { label: "Beranda", href: "/" },
              { label: "AI Agri-Consultant", href: "/agri-consultant" },
              { label: "Limbah Analyzer" },
            ]}
          />

          <div className="mt-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Limbah Analyzer
              </h1>

              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {t("hero.subtitle")}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsGuideOpen(true)}
              className="self-start md:self-end shrink-0 rounded-2xl border-primary/30 bg-white hover:bg-primary/5 hover:border-primary text-primary font-semibold text-xs shadow-2xs gap-2 px-4 py-2.5 cursor-pointer dark:bg-gray-900"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Panduan Penggunaan</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Feature Guide Modal ─────────────────────────────────────── */}
      <FeatureGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="Panduan Penggunaan Limbah Analyzer"
        subtitle="Ikuti langkah praktis berikut untuk menganalisis limbah pertanian dan mengetahui potensi nilai jualnya secara instan."
        steps={LIMBAH_GUIDE_STEPS}
        storageKey="looptani_guide_limbah_analyzer"
      />

      {/* ── Main Analyzer Card ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
        {apiError && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{apiError}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div key="upload" {...fadeSlide}>
                <UploadStep onAnalyze={handleAnalyze} />
              </motion.div>
            )}

            {step === "loading" && (
              <motion.div key="loading" {...fadeSlide}>
                <LoadingStep />
              </motion.div>
            )}

            {step === "result" && result && (
              <motion.div key="result" {...fadeSlide}>
                <ResultStep
                  key={preview}
                  result={result}
                  preview={preview}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LimbahAnalyzer;

"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { FeatureGuideModal, type GuideStep } from "@/components/shared/feature-guide-modal";
import FormStep from "./form-step";
import LoadingStep from "./loading-step";
import ResultStep from "./result-step";
import {
  type FarmFormData,
  type CalculationResult,
  type MarketplaceProduct,
} from "../lib/dummy-data";
import { recommendFertilizer } from "../lib/engine";
import { getProducts } from "@/features/marketplace/api/get-products";

type Step = "form" | "loading" | "result";

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const FertilizerCalculator = () => {
  const t = useTranslations("fertilizer");
  const tAgri = useTranslations("agriConsultant");
  const locale = useLocale();
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [liveProducts, setLiveProducts] = useState<MarketplaceProduct[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const guideSteps: GuideStep[] = [
    {
      stepNumber: 1,
      title: t("guide.step1.title"),
      description: t("guide.step1.desc"),
      tip: t("guide.step1.tip"),
    },
    {
      stepNumber: 2,
      title: t("guide.step2.title"),
      description: t("guide.step2.desc"),
    },
    {
      stepNumber: 3,
      title: t("guide.step3.title"),
      description: t("guide.step3.desc"),
    },
    {
      stepNumber: 4,
      title: t("guide.step4.title"),
      description: t("guide.step4.desc"),
    },
  ];
  const [formData, setFormData] = useState<FarmFormData>({
    cropType: "",
    landSize: "",
    unit: "Hektar",
    soilType: "",
    growthStage: "",
  });

  // Auto-open guide on first access
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("looptani_guide_fertilizer_calculator");
      if (!dismissed) {
        setIsGuideOpen(true);
      }
    } catch {
      setIsGuideOpen(true);
    }
  }, []);

  // Fetch real marketplace products from backend
  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 6 })
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const mapped: MarketplaceProduct[] = res.data.map((p) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            slug: p.slug,
            image: p.images?.[0]?.imageUrl || p.thumbnail || undefined,
            storeName: p.seller?.name || "LoopTani Verified Seller",
          }));
          setLiveProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live marketplace products:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCalculate = useCallback(
    (data: FarmFormData) => {
      setStep("loading");
      const delay = 1400 + Math.random() * 600;
      setTimeout(() => {
        const calcResult = recommendFertilizer(data, locale, liveProducts);
        setResult(calcResult);
        setStep("result");
      }, delay);
    },
    [locale, liveProducts]
  );

  const handleReset = useCallback(() => {
    setStep("form");
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16 dark:bg-gray-950 font-poppins">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-6 sm:px-6 lg:px-8 sm:pt-10 sm:pb-8">
          <Breadcrumbs
            items={[
              { label: tAgri("breadcrumb"), href: "/agri-consultant" },
              { label: tAgri("features.calculator.title") },
            ]}
          />

          <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t("hero.title")}
              </h1>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {t("hero.subtitle")}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsGuideOpen(true)}
              className="self-start md:self-end shrink-0 rounded-2xl border-primary/30 bg-white hover:bg-primary/5 hover:border-primary text-primary font-semibold text-xs shadow-2xs gap-2 px-4 py-2.5 cursor-pointer dark:bg-gray-900"
            >
              <HelpCircle className="h-4 w-4" />
              <span>{t("guide.button")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Feature Guide Modal ─────────────────────────────────────── */}
      <FeatureGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title={t("guide.title")}
        subtitle={t("guide.subtitle")}
        badgeText={t("guide.badge")}
        dontShowAgainText={t("guide.dontShowAgain")}
        buttonText={t("guide.understandBtn")}
        tipPrefix={t("guide.tipPrefix")}
        steps={guideSteps}
        storageKey="looptani_guide_fertilizer_calculator"
      />

      {/* ── Main Calculator Card ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div key="form" {...fadeSlide}>
                <FormStep
                  formData={formData}
                  onChange={setFormData}
                  onCalculate={handleCalculate}
                />
              </motion.div>
            )}

            {step === "loading" && (
              <motion.div key="loading" {...fadeSlide}>
                <LoadingStep />
              </motion.div>
            )}

            {step === "result" && result && (
              <motion.div key="result" {...fadeSlide}>
                <ResultStep result={result} onReset={handleReset} />
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 text-center text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                  <p>
                    <strong>Disclaimer:</strong> Rekomendasi ini merupakan estimasi berbasis acuan dosis resmi dan penyesuaian agronomi tanah sebagai pendukung keputusan pertanian, bukan pengganti uji laboratorium spesifik lokasi.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FertilizerCalculator;

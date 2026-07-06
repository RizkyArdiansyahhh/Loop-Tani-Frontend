"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sprout, Download, Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import FormStep from "./form-step";
import LoadingStep from "./loading-step";
import ResultStep from "./result-step";
import AiInsight from "./ai-insight";
import {
  type FarmFormData,
  type CalculationResult,
  dummyResult,
} from "../lib/dummy-data";

type Step = "form" | "loading" | "result";

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

const FertilizerCalculator = () => {
  const t = useTranslations("fertilizer");
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [formData, setFormData] = useState<FarmFormData>({
    cropType: "",
    landSize: "",
    unit: "Hektar",
    soilType: "",
    growthStage: "",
  });

  const handleCalculate = useCallback(() => {
    setStep("loading");
    const delay = 2000 + Math.random() * 1000;
    setTimeout(() => {
      setResult(dummyResult);
      setStep("result");
    }, delay);
  }, []);

  const handleReset = useCallback(() => {
    setStep("form");
    setResult(null);
  }, []);

  return (
    <div className="relative overflow-hidden pb-20">
      {/* Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -right-20 top-1/4 h-[400px] w-[400px] rounded-full bg-secondary/30 blur-[100px]" />
        <div className="absolute left-1/3 top-1/2 h-[350px] w-[350px] rounded-full bg-accent/15 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* ── Hero: centered ── */}
        <motion.div
          className="mx-auto max-w-3xl px-4 pt-16 text-center sm:pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          {/* Badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sprout className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => {
                document
                  .getElementById("calculator-card")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              <Sparkles className="h-4 w-4" />
              {t("hero.cta")}
            </button>
          </motion.div>
        </motion.div>

        {/* Spacer */}
        <div className="h-16 sm:h-20" />

        {/* ── Main Card ── */}
        <div id="calculator-card" className="mx-auto max-w-4xl px-4">
          <motion.div
            className="overflow-hidden rounded-3xl border border-border/50 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
          >
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── AI Insight ── */}
        {step === "result" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AiInsight result={result} />
          </motion.div>
        )}

        {/* ── Bottom CTA ── */}
        <motion.div
          className="mx-auto mt-12 max-w-5xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-linear-to-r from-primary/5 to-background p-8 backdrop-blur-sm sm:flex-row sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("bottomCta.title")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("bottomCta.description")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted">
                <Download className="h-4 w-4" />
                {t("bottomCta.secondary")}
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl">
                <Bookmark className="h-4 w-4" />
                {t("bottomCta.primary")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FertilizerCalculator;

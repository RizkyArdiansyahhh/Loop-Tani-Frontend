"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import RotatingText from "./rotating-text";
import UploadStep from "./upload-step";
import LoadingStep from "./loading-step";
import ResultStep from "./result-step";
import {
  type AnalysisResult,
  getRandomAnalysisResult,
} from "../lib/dummy-data";

type Step = "upload" | "loading" | "result";

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

const LimbahAnalyzer = () => {
  const t = useTranslations("analyzer");
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleAnalyze = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setStep("loading");

    const delay = 2000 + Math.random() * 1000;
    setTimeout(() => {
      setResult(getRandomAnalysisResult());
      setStep("result");
    }, delay);
  }, []);

  const handleReset = useCallback(() => {
    setStep("upload");
    setResult(null);
    setPreview("");
  }, []);

  return (
    <div className="relative overflow-hidden pb-20">
      {/* Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -right-20 top-1/4 h-[400px] w-[400px] rounded-full bg-secondary/30 blur-[100px]" />
        <div className="absolute left-1/3 top-1/2 h-[350px] w-[350px] rounded-full bg-accent/15 blur-[100px]" />
        <div className="absolute -right-10 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          className="mx-auto max-w-4xl px-4 pt-16 text-center sm:pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          {/* Badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-xs font-semibold text-accent-background">
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span>{t("hero.titlePrefix")}</span>
            <br />
            <span>
              {t("hero.titleMiddle")}{" "}
              <RotatingText
                texts={t.raw("hero.rotatingTexts") as string[]}
                mainClassName="rounded-lg bg-primary text-primary-foreground text-center leading-tight py-2"
                splitLevelClassName="overflow-hidden"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                splitBy="characters"
                loop
              />
            </span>
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

          {/* Primary CTA */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => {
                document.getElementById("analyzer-card")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
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

        {/* Main Analyzer Card */}
        <div id="analyzer-card" className="mx-auto max-w-5xl px-4">
          <motion.div
            className="overflow-hidden rounded-3xl border border-border/50 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
          >
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
                    result={result}
                    preview={preview}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mx-auto mt-12 max-w-5xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-background p-8 backdrop-blur-sm sm:flex-row sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 4 17 4.48 19.2 6.5c2 2 2.5 5.5 1 8.5-1.5 3-4.5 4-6 5" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
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
            <button className="shrink-0 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl">
              {t("bottomCta.button")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LimbahAnalyzer;

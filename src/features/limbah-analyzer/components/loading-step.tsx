"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingStep = () => {
  const t = useTranslations("analyzer");

  const statusMessages = [
    t("loading.identifying"),
    t("loading.analyzing"),
    t("loading.estimating"),
    t("loading.generating"),
  ];

  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) =>
        prev < statusMessages.length - 1 ? prev + 1 : prev,
      );
    }, 600);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* LEFT — Loading Animation (65%) */}
      <div className="flex flex-1 flex-col items-center justify-center border-border/40 p-10 lg:border-r lg:p-12">
        {/* Spinner */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-[3px] border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ScanSearch className="h-9 w-9 text-primary" />
          </motion.div>
        </div>

        {/* Status Message */}
        <div className="mb-6 flex h-6 items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-medium text-foreground"
            >
              {statusMessages[statusIndex]}
            </motion.p>
          </AnimatePresence>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 95)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {Math.round(Math.min(progress, 95))}% {t("loading.complete")}
          </p>
        </div>
      </div>

      {/* RIGHT — Skeleton Preview (35%) */}
      <div className="flex flex-col bg-muted/20 p-10 lg:w-[35%] lg:p-12">
        <div className="mb-6">
          <Skeleton className="h-5 w-24 rounded-md bg-primary/15" />
          <Skeleton className="mt-2 h-3 w-40 rounded bg-muted/60" />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-xl bg-primary/10" />
              <div className="flex flex-1 items-center justify-between">
                <Skeleton className="h-3 w-16 rounded bg-muted/60" />
                <Skeleton className="h-6 w-20 rounded-full bg-primary/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-primary/5 p-4">
          <Skeleton className="h-3 w-32 rounded bg-primary/10" />
          <Skeleton className="mt-2 h-2.5 w-full rounded bg-muted/40" />
          <Skeleton className="mt-1.5 h-2.5 w-3/4 rounded bg-muted/40" />
        </div>
      </div>
    </div>
  );
};

export default LoadingStep;

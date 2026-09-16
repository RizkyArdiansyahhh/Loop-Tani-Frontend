"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, Calculator } from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingStep = () => {
  const t = useTranslations("fertilizer");

  const statusMessages = [
    t("loading.understanding"),
    t("loading.calculating"),
    t("loading.optimizing"),
    t("loading.preparing"),
  ];

  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) =>
        prev < statusMessages.length - 1 ? prev + 1 : prev
      );
    }, 700);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 8 + 3;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const currentPercent = Math.min(Math.round(progress), 95);

  return (
    <div className="p-6 sm:p-10 lg:p-14">
      <div className="mx-auto max-w-md text-center">
        {/* Mascot & Scan Animation */}
        <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center">
          {/* Animated Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -inset-2 rounded-full border border-dashed border-primary/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Mascot Image */}
          <motion.div
            className="relative z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-primary/5 p-2"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/maskot/maskot-kalkulator.png"
              alt="Maskot Loopi Kalkulator"
              width={110}
              height={110}
              priority
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </motion.div>

          {/* Floating Badge */}
          <div className="absolute -bottom-2 -right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Calculator className="h-4 w-4" />
          </div>
        </div>

        {/* Dynamic Status Message */}
        <div className="mb-4 flex h-7 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-base font-bold text-gray-900 dark:text-white"
            >
              {statusMessages[statusIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span>Agronomic Calculation Processing</span>
            <span>{currentPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              style={{ width: `${currentPercent}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        {/* Step Checkmarks */}
        <div className="space-y-2.5 text-left">
          {statusMessages.map((msg, i) => {
            const isDone = i < statusIndex;
            const isCurrent = i === statusIndex;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 ${
                  isCurrent
                    ? "border border-primary/20 bg-primary/10 text-primary font-medium"
                    : isDone
                    ? "bg-primary/5 text-gray-700 dark:text-gray-200"
                    : "opacity-40 text-gray-400 dark:text-gray-500"
                }`}
              >
                <CircleCheck
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isDone || isCurrent ? "text-primary" : "text-gray-300 dark:text-gray-600"
                  }`}
                />
                <span className="text-xs sm:text-sm truncate">{msg}</span>
              </div>
            );
          })}
        </div>

        {/* Subtle skeleton card placeholders */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
          <Skeleton className="h-4 w-3/4 mx-auto rounded-lg bg-primary/10" />
          <Skeleton className="h-3 w-1/2 mx-auto rounded-lg bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default LoadingStep;

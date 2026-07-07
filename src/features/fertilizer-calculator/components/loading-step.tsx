"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Brain, CircleCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingStep = () => {
  const t = useTranslations("fertilizer");
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const messages = [
    t("loading.understanding"),
    t("loading.calculating"),
    t("loading.optimizing"),
    t("loading.preparing"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCompletedSteps((prev) => {
        const nextIndex = prev.length;
        if (nextIndex >= messages.length) {
          clearInterval(stepInterval);
          return prev;
        }
        return [...prev, nextIndex];
      });
    }, 600);
    return () => clearInterval(stepInterval);
  }, [messages.length]);

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-lg">
        {/* Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-muted-foreground">
              {progress}% {t("loading.complete")}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checkmark Messages */}
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                completedSteps.includes(i) ? "bg-primary/5" : "opacity-40"
              }`}
            >
              <CircleCheck
                className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                  completedSteps.includes(i)
                    ? "text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  completedSteps.includes(i)
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {msg}
              </span>
            </div>
          ))}
        </div>

        {/* Skeleton preview */}
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-3/4 rounded-lg bg-primary/10" />
          <Skeleton className="h-4 w-1/2 rounded-lg bg-primary/10" />
          <Skeleton className="h-4 w-2/3 rounded-lg bg-primary/10" />
        </div>
      </div>
    </div>
  );
};

export default LoadingStep;

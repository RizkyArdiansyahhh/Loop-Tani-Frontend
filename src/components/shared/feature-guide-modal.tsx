"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
}

interface FeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  steps: GuideStep[];
  storageKey?: string;
}

export function FeatureGuideModal({
  isOpen,
  onClose,
  title,
  subtitle,
  steps,
  storageKey,
}: FeatureGuideModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain && storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, "true");
      } catch (e) {
        // Ignore storage errors
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg sm:max-w-xl rounded-3xl p-6 sm:p-8 font-poppins bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Panduan Praktis
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Steps List */}
        <div className="space-y-3.5 py-4">
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-150/70 dark:bg-gray-850/50 dark:border-gray-800 transition-colors"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold shadow-2xs">
                {step.stepNumber}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {step.tip && (
                  <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg w-fit mt-1.5 border border-emerald-200/50 dark:border-emerald-800/40">
                    💡 Tip: {step.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
          {storageKey && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span>Jangan tampilkan otomatis lagi saat membuka halaman</span>
            </label>
          )}

          <Button
            onClick={handleClose}
            className="w-full h-11 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mengerti & Mulai Menggunakan</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeatureGuideModal;

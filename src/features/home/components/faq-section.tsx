"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, MessageSquare, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const FAQ_KEYS = [
  "apaItuLooptani",
  "kenapaLooptani",
  "caraJadiSeller",
  "apaItuLoopiAi",
  "limbahAnalyzerKalkulator",
  "keamananTransaksi",
] as const;

export const FaqSection = () => {
  const t = useTranslations("faq");
  const [openId, setOpenId] = useState<string | null>("apaItuLooptani");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative z-10 border-t border-gray-150 bg-white/50 dark:bg-gray-950 dark:border-gray-850 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading & Support Card */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">
                <HelpCircle className="h-3.5 w-3.5 fill-current text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {t("badge")}
                </span>
              </div>
              <h2 className="font-fraunces text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 dark:text-white leading-tight">
                {t("title")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* Still have questions Card matching image layout */}
            <div className="relative border border-primary/20 bg-emerald-500/5 dark:bg-emerald-950/20 dark:border-emerald-900/30 rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="space-y-1.5">
                <h3 className="font-fraunces text-lg font-bold text-gray-950 dark:text-white">
                  {t("supportTitle")}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("supportSubtitle")}
                </p>
              </div>
              <div className="pt-1">
                <Button
                  asChild
                  className="rounded-xl font-bold bg-primary hover:bg-emerald-700 text-white text-xs shadow-xs px-4 py-2.5 h-auto cursor-pointer"
                >
                  <Link href="/loopi" className="inline-flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {t("supportCta")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion list with Plus/Minus Icons */}
          <div className="lg:col-span-7 space-y-3.5">
            {FAQ_KEYS.map((key) => {
              const isOpen = openId === key;
              const question = t(`items.${key}.question`);
              const answer = t(`items.${key}.answer`);

              return (
                <div
                  key={key}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-primary/40 bg-white shadow-sm dark:bg-gray-900 dark:border-primary/40"
                      : "border-gray-200 bg-white/70 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/40"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(key)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer group select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans font-bold text-xs sm:text-sm text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                      {question}
                    </span>
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 group-hover:bg-gray-200"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-gray-100 dark:border-gray-800/60">
                          {answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

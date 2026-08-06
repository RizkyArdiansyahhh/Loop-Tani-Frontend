"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

const FAQ_KEYS = [
  "apaItuLooptani",
  "kenapaLooptani",
  "caraJadiSeller",
  "apaItuLoopiAi",
  "limbahAnalyzerKalkulator",
  "keamananTransaksi",
] as const;

export function FaqSection() {
  const t = useTranslations("faq");
  const [openId, setOpenId] = useState<string | null>("apaItuLooptani");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative z-10 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 py-20 md:py-28 font-poppins select-none">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Huge 2-line Headline + Subtitle + Direct Arrow Text Link (Matching Reference Image) */}
          <div className="lg:col-span-5 space-y-6 text-left font-poppins">
            <div className="space-y-4">
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-[1.15]">
                Ada pertanyaan?<br />
                Kami siap membantu.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-poppins max-w-sm">
                {t("subtitle")}
              </p>
            </div>

            {/* Direct Arrow Link (No Card Container, No Background Colors) */}
            <div className="pt-2">
              <Link
                href="/loopi"
                className="font-poppins text-xs sm:text-sm font-bold text-primary dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t("supportCta")}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Horizontal Line Accordion List (Matching Reference Image) */}
          <div className="lg:col-span-7 font-poppins border-t border-stone-300 dark:border-stone-800">
            {FAQ_KEYS.map((key) => {
              const isOpen = openId === key;
              const question = t(`items.${key}.question`);
              const answer = t(`items.${key}.answer`);

              return (
                <div
                  key={key}
                  className="border-b border-stone-300 dark:border-stone-800 py-5"
                >
                  <button
                    onClick={() => toggleFaq(key)}
                    className="w-full flex items-center justify-between gap-6 text-left cursor-pointer group select-none py-0.5"
                    aria-expanded={isOpen}
                  >
                    <span className="font-poppins font-bold text-sm sm:text-base text-stone-950 dark:text-white leading-snug group-hover:text-primary transition-colors">
                      {question}
                    </span>
                    
                    {/* Minimalist Indicator (+ / -) */}
                    <span className="font-mono text-sm sm:text-base text-stone-700 dark:text-stone-300 shrink-0 font-semibold select-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 pb-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-poppins max-w-xl">
                          {answer}
                        </p>
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
}

export default FaqSection;

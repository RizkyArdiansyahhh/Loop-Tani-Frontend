"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/shared/breadcrumbs";

export default function AgriConsultantPage() {
  const t = useTranslations("agriConsultant");

  const cards = [
    {
      id: "loopi",
      title: t("features.loopi.title"),
      tag: t("features.loopi.tag"),
      description: t("features.loopi.description"),
      cta: t("features.loopi.cta"),
      href: "/loopi",
      mascot: "/images/maskot/maskot-chatbot.png",
    },
    {
      id: "analyzer",
      title: t("features.analyzer.title"),
      tag: t("features.analyzer.tag"),
      description: t("features.analyzer.description"),
      cta: t("features.analyzer.cta"),
      href: "/limbah-analyzer",
      mascot: "/images/maskot/maskot-limbah.png",
    },
    {
      id: "calculator",
      title: t("features.calculator.title"),
      tag: t("features.calculator.tag"),
      description: t("features.calculator.description"),
      cta: t("features.calculator.cta"),
      href: "/fertilizer-calculator",
      mascot: "/images/maskot/maskot-kalkulator.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-12 dark:bg-gray-950 font-poppins">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-gray-950">
        <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-6 sm:px-6 lg:px-8 sm:pt-10 sm:pb-8">
          <Breadcrumbs
            items={[
              { label: t("breadcrumb") },
            ]}
          />

          <div className="mt-6 sm:mt-8 max-w-3xl">
            <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("title")}
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3 Main AI Cards (Side-by-Side Grid) ───────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
            >
              <div>
                {/* Large Mascot Frame */}
                <div className="relative mb-4 flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-50/80 p-2 transition-colors group-hover:bg-primary/5 dark:bg-gray-800/40 sm:h-56">
                  <Image
                    src={card.mascot}
                    alt={card.title}
                    width={260}
                    height={260}
                    priority
                    className="h-44 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-48"
                  />
                </div>

                <span className="inline-block rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {card.tag}
                </span>

                <h2 className="mt-2.5 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  {card.title}
                </h2>

                <p className="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-sm">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-1">
                <Link
                  href={card.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

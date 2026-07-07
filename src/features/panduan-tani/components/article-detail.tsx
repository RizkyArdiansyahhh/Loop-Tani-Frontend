"use client";

import React, { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowLeft, BookOpen, Clock, Tag, ShoppingBag, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanduanContent } from "../lib/dummy-data";
import { toast } from "sonner";
import Breadcrumbs from "@/components/shared/breadcrumbs";

interface ArticleDetailProps {
  article: PanduanContent;
  onEarnPoints: (points: number) => void;
}

export default function ArticleDetail({ article, onEarnPoints }: ArticleDetailProps) {
  const t = useTranslations("panduan");
  const router = useRouter();
  const [pointsClaimed, setPointsClaimed] = useState(false);

  // Trigger points reward on scroll to end
  useEffect(() => {
    if (pointsClaimed) return;

    const handleScroll = () => {
      const threshold = 50; // pixels from bottom
      const totalHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;

      if (totalHeight - scrollPosition <= threshold) {
        claimPoints();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pointsClaimed]);

  const claimPoints = () => {
    if (pointsClaimed) return;
    setPointsClaimed(true);
    onEarnPoints(20);
    toast.success(t("congratsTitle"), {
      description: t("pointsEarnedToast", { points: 20 }),
      icon: <Sparkles className="h-5 w-5 fill-current text-yellow-500" />,
      duration: 4000,
    });
  };

  const paragraphs = article.content.split("\n\n");

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      {/* Article Header & Navigation */}
      <div className="mx-auto max-w-4xl px-4 pt-8 space-y-4">
        <Breadcrumbs
          items={[
            { label: "Panduan Tani", href: "/panduan-tani" },
            { label: "Artikel", href: "/panduan-tani" },
            { label: article.title },
          ]}
        />
        <button
          onClick={() => router.back()}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-650 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Panduan
        </button>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4">
        {/* Article Card Wrapper */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          
          {/* Unsplash Hero Image */}
          <div className="relative aspect-[21/9] w-full bg-muted">
            <img
              src={article.imageUrl || `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80`}
              alt={article.title}
              className="h-full w-full object-cover"
            />
            {/* Title / Header overlay elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-2xs font-bold text-gray-900 shadow-xs backdrop-blur-xs dark:bg-gray-800/90 dark:text-white uppercase tracking-wider">
                {t(`categoryLabel.${article.category}`)}
              </span>
              <span className="rounded-full bg-primary px-3 py-1 text-2xs font-bold text-white shadow-xs uppercase tracking-wider">
                {t(`difficultyLabel.${article.difficulty}`)}
              </span>
            </div>
          </div>

          {/* Article Info & Body */}
          <div className="p-6 sm:p-10">
            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-b border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {article.duration}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-4 w-4 fill-current" />
                  +20 LP Reward
                </span>
              </div>
              
              {/* Point Status Tracker */}
              {pointsClaimed ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  ✓ Reward LP Berhasil Didapat
                </span>
              ) : (
                <span className="animate-pulse rounded-full bg-amber-50 px-3 py-1 text-2xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  📖 Baca hingga akhir untuk +20 LP
                </span>
              )}
            </div>

            {/* Title - Custom FRAUNCES font */}
            <h1 className="font-fraunces text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>

            {/* Author/Uploader Card */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/40">
              <img
                src={article.uploader.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"}
                alt={article.uploader.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-2xs text-muted-foreground leading-none mb-1">
                  {t("uploadBy")}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {article.uploader.name}
                  {article.uploader.role === "Petani Ahli" && (
                    <Award className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                  )}
                </span>
                <span className="text-3xs text-muted-foreground leading-none">
                  {article.uploader.role}
                </span>
              </div>
            </div>

            {/* Prose Content */}
            <div className="prose prose-emerald max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-6">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* CTA Section "Praktikkan Sekarang" */}
            <div className="mt-12 rounded-3xl bg-radial from-emerald-50 to-white border border-emerald-100/50 p-6 sm:p-8 text-center dark:from-emerald-950/10 dark:to-gray-900 dark:border-emerald-900/20">
              <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white mb-2">
                Siap mempraktikkan isi panduan ini?
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
                Beli perlengkapan pendukung atau cari listing produk hasil olahan jerami padi biomassa di LoopTani Marketplace.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 px-6 py-5"
                >
                  <Link href={`/marketplace/produk/${article.relatedListingSlug}`}>
                    <ShoppingBag className="h-5 w-5" />
                    {t("ctaPractice")}
                  </Link>
                </Button>
                
                {!pointsClaimed && (
                  <Button
                    variant="outline"
                    onClick={claimPoints}
                    className="w-full sm:w-auto rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold dark:border-amber-900 dark:text-amber-400"
                  >
                    <Sparkles className="h-4 w-4 mr-2 fill-current text-yellow-500" />
                    Selesai Membaca
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </article>
  );
}

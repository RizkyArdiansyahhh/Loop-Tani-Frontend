"use client";

import React, { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  Clock,
  ShoppingBag,
  Award,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeContent } from "@/types/api";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useReadingProgress } from "../hooks/use-reading-progress";
import { useProgress } from "../hooks/use-progress";
import { useCompleteContent } from "../hooks/use-complete-content";
import { useClaimReward } from "../hooks/use-claim-reward";
import { authClient } from "@/lib/auth-client";
import { CommentsSection } from "./comments-section";

interface ArticleDetailProps {
  article: KnowledgeContent;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  const t = useTranslations("panduan");
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // 1. Fetch backend progress
  const {
    data: progress,
    isLoading: isProgressLoading,
    refetch: refetchProgress,
  } = useProgress(article.id, !!session);

  const completed = progress?.completed ?? false;
  const claimed = progress?.rewardClaimed ?? false;

  // 2. Track local reading progress
  const {
    scrollPercentage,
    activeReadingSeconds,
    meetsScroll,
    meetsTime,
    meetsThreshold,
    targetReadingSeconds,
  } = useReadingProgress({
    estimatedReadingMinutes: article.estimatedReadingMinutes || 5,
    completed,
    enabled: !!session,
  });

  // Mutations
  const completeMutation = useCompleteContent();
  const claimMutation = useClaimReward();
  const [completeSent, setCompleteSent] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(true);

  // 3. Automatically report completion once local thresholds are satisfied
  useEffect(() => {
    if (
      session &&
      meetsThreshold &&
      !completed &&
      !completeSent &&
      !completeMutation.isPending
    ) {
      setCompleteSent(true);
      completeMutation.mutate(
        {
          contentId: article.id,
          payload: {
            scrollPercentage,
            activeReadingSeconds,
          },
        },
        {
          onSuccess: () => {
            refetchProgress();
          },
        },
      );
    }
  }, [
    session,
    meetsThreshold,
    completed,
    completeSent,
    scrollPercentage,
    activeReadingSeconds,
    article.id,
  ]);

  const handleClaim = () => {
    if (claimMutation.isPending) return;
    claimMutation.mutate(article.id, {
      onSuccess: () => {
        refetchProgress();
      },
    });
  };

  const paragraphs = article.content.split("\n\n");

  return (
    <div className="min-h-screen bg-white pb-24 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Top Banner Navigation */}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { label: "Panduan Tani", href: "/panduan-tani" },
            { label: "Artikel", href: "/panduan-tani" },
            { label: article.title },
          ]}
        />
        
        <button
          onClick={() => router.back()}
          className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Panduan
        </button>
      </div>

      {/* Main Medium-style Container */}
      <article className="mx-auto max-w-3xl px-4 mt-8">
        
        {/* Badges Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary dark:bg-primary/20">
            {t("categoryLabel." + article.category?.toLowerCase())}
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-bold text-gray-700 dark:text-gray-300">
            {t("difficultyLabel." + article.difficulty?.toLowerCase())}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-6 tracking-tight">
          {article.title}
        </h1>

        {/* Meta Header: Author and Reading Details */}
        <div className="flex items-center gap-4 py-6 border-y border-gray-100 dark:border-gray-850 mb-8">
          <img
            src={
              article.uploader.avatarUrl ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
            }
            alt={article.uploader.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-50 dark:ring-gray-850"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              {article.uploader.name}
              {article.uploader.role === "Petani Ahli" && (
                <Award className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {article.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                <Sparkles className="h-3.5 w-3.5 fill-current text-amber-500" />
                +{article.points} LP Reward
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[21/9] sm:aspect-[2.2/1] w-full bg-muted overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-850 shadow-2xs mb-10">
          <img
            src={
              article.imageUrl ||
              `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80`
            }
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Article Body (Medium-style Prose layout) */}
        <div className="prose prose-lg prose-emerald max-w-none text-gray-850 dark:text-gray-255 space-y-6 leading-relaxed md:leading-loose text-base md:text-lg">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="tracking-wide text-justify">
              {para}
            </p>
          ))}
        </div>

        {/* Bottom CTA Marketplace */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 p-8 sm:p-10 text-center shadow-2xs">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl"></div>
          
          <div className="relative z-10 space-y-4">
            <h3 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              Siap mempraktikkan isi panduan ini?
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Temukan dan beli perlengkapan pendukung atau cari listing produk hasil
              panen terkait di LoopTani Marketplace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 px-8 py-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Link href={`/marketplace`}>
                  <ShoppingBag className="h-5 w-5" />
                  Kunjungi Marketplace
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 border-t border-gray-100 dark:border-gray-850 pt-10">
          <CommentsSection contentId={article.id} />
        </div>

      </article>

      {/* Floating Progress Tracker Widget (Medium-style bottom-right helper) */}
      {session && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl transition-all duration-300 overflow-hidden ${
            isTrackerOpen ? "w-64 p-5 scale-100" : "w-14 h-14 flex items-center justify-center p-0 scale-95 hover:scale-100"
          }`}>
            {isTrackerOpen ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-850 pb-2">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Progress Membaca</h4>
                  <button onClick={() => setIsTrackerOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 dark:bg-gray-850 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground block font-medium">Posisi</span>
                    <span className={`text-xs font-bold ${meetsScroll ? "text-emerald-600" : "text-amber-600"}`}>
                      {Math.round(scrollPercentage)}% <span className="text-[9px] font-normal text-muted-foreground">/ 90%</span>
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-850 p-2.5 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground block font-medium">Waktu</span>
                    <span className={`text-xs font-bold ${meetsTime ? "text-emerald-600" : "text-amber-600"}`}>
                      {activeReadingSeconds}s <span className="text-[9px] font-normal text-muted-foreground">/ {targetReadingSeconds}s</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  {claimed ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-4.5 w-4.5" /> LP Berhasil Didapat
                    </span>
                  ) : completed ? (
                    <Button
                      onClick={handleClaim}
                      disabled={claimMutation.isPending}
                      className="w-full py-2.5 h-auto text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      Klaim {article.points} LP
                    </Button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground block leading-normal">
                      Selesaikan membaca untuk mendapat +{article.points} LP
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="w-full h-full flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-muted/10 relative"
                title="Buka Progress Membaca"
              >
                {/* Circular indicator outline */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform p-1" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="currentColor" strokeWidth="2.5" className="text-gray-100 dark:text-gray-800" />
                  <circle
                    cx="18" cy="18" r="14" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className="text-primary transition-all duration-300"
                    strokeDasharray="87.96"
                    strokeDashoffset={87.96 - (Math.min((scrollPercentage / 90 + activeReadingSeconds / targetReadingSeconds) / 2, 1)) * 87.96}
                  />
                </svg>
                <Sparkles className="h-5 w-5 fill-current text-amber-500 animate-pulse z-10" />
              </button>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}

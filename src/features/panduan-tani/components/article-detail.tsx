"use client";

import React, { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowLeft, BookOpen, Clock, Tag, ShoppingBag, User, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeContent } from "@/types/api";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useReadingProgress } from "../hooks/use-reading-progress";
import { useProgress } from "../hooks/use-progress";
import { useCompleteContent } from "../hooks/use-complete-content";
import { useClaimReward } from "../hooks/use-claim-reward";
import { authClient } from "@/lib/auth-client";

interface ArticleDetailProps {
  article: KnowledgeContent;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  const t = useTranslations("panduan");
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // 1. Fetch backend progress
  const { data: progress, isLoading: isProgressLoading, refetch: refetchProgress } = useProgress(
    article.id,
    !!session
  );

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
  });

  // Mutations
  const completeMutation = useCompleteContent();
  const claimMutation = useClaimReward();
  const [completeSent, setCompleteSent] = useState(false);

  // 3. Automatically report completion once local thresholds are satisfied
  useEffect(() => {
    if (session && meetsThreshold && !completed && !completeSent && !completeMutation.isPending) {
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
        }
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

  // Format progress for visual tracker
  const scrollText = `Scroll: ${Math.round(scrollPercentage)}/90%`;
  const timeText = `Baca: ${activeReadingSeconds}/${targetReadingSeconds}s`;

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      {/* Article Header & Navigation */}
      <div className="mx-auto max-w-6xl px-4 pt-8 space-y-4">
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
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Article Content */}
          <div className="lg:col-span-8">
            {/* Article Card Wrapper */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          
          {/* Cover Image */}
          <div className="relative aspect-21/9 w-full bg-muted">
            <img
              src={article.imageUrl || `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80`}
              alt={article.title}
              className="h-full w-full object-cover"
            />
            {/* Title / Header overlay elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-2xs font-bold text-gray-900 shadow-xs backdrop-blur-xs dark:bg-gray-800/90 dark:text-white uppercase tracking-wider">
                {t("categoryLabel." + article.category?.toLowerCase())}
              </span>
              <span className="rounded-full bg-primary px-3 py-1 text-2xs font-bold text-white shadow-xs uppercase tracking-wider">
                {t("difficultyLabel." + article.difficulty?.toLowerCase())}
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
                  +{article.points} LP Reward
                </span>
              </div>
              
              {/* Point Status Tracker */}
              {claimed ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  ✓ Reward LP Berhasil Didapat
                </span>
              ) : completed ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-2xs font-bold text-amber-800 animate-pulse">
                  🎉 Selesai membaca! Silakan klaim poin di bawah.
                </span>
              ) : session ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-2xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  📖 {scrollText} | {timeText} untuk +{article.points} LP
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-2xs font-semibold text-gray-500">
                  Masuk untuk mengumpulkan LoopPoints
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

            {/* CTA Section */}
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
                  <Link href={`/marketplace`}>
                    <ShoppingBag className="h-5 w-5" />
                    {t("ctaPractice")}
                  </Link>
                </Button>
                
                {session && !claimed && (
                  <Button
                    onClick={handleClaim}
                    disabled={!completed || claimMutation.isPending}
                    className={`w-full sm:w-auto rounded-xl font-semibold flex items-center justify-center gap-2 px-6 py-5 ${
                      completed
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-bounce"
                        : "bg-gray-100 text-gray-400 border border-gray-250 cursor-not-allowed dark:bg-gray-800 dark:text-gray-650"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 fill-current text-yellow-300 animate-pulse" />
                    {completed ? "Klaim LoopPoints" : `Selesai Membaca (${Math.round(scrollPercentage)}%)`}
                  </Button>
                )}

                {session && claimed && (
                  <Button
                    disabled
                    className="w-full sm:w-auto rounded-xl bg-emerald-50 text-emerald-700 font-semibold border-emerald-150 border flex items-center justify-center gap-2 px-6 py-5 cursor-default opacity-100 dark:bg-emerald-950/20 dark:text-emerald-400"
                  >
                    ✓ LoopPoints Berhasil Diklaim
                  </Button>
                )}
              </div>
            </div>

            </div>
          </div>
        </div>

        {/* Right Column: Sticky Progress Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <h3 className="font-fraunces text-base font-bold text-gray-900 dark:text-white">
                    Progress Membaca
                  </h3>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                    <Sparkles className="h-4.5 w-4.5 fill-current animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Scroll Progress */}
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-medium text-muted-foreground">Posisi Halaman</span>
                      <span className="font-bold text-primary">{Math.round(scrollPercentage)}% / 90%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          meetsScroll ? "bg-emerald-500" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(scrollPercentage / 0.9, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Time Progress */}
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-medium text-muted-foreground">Durasi Membaca</span>
                      <span className="font-bold text-primary">{activeReadingSeconds}s / {targetReadingSeconds}s</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          meetsTime ? "bg-emerald-500" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min((activeReadingSeconds / targetReadingSeconds) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                    {claimed ? (
                      <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Poin Telah Diklaim</span>
                        </div>
                        <p className="text-3xs text-emerald-600 mt-1 dark:text-emerald-500">
                          Anda berhasil mengumpulkan +{article.points} LP dari panduan ini.
                        </p>
                      </div>
                    ) : completed ? (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/20">
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                            🎉 Selamat! Selesai membaca.
                          </p>
                        </div>
                        {session ? (
                          <Button
                            onClick={handleClaim}
                            disabled={claimMutation.isPending}
                            className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
                          >
                            <Sparkles className="mr-2 h-4 w-4 fill-current text-yellow-255" />
                            Klaim {article.points} LP Sekarang
                          </Button>
                        ) : (
                          <div className="text-xs text-muted-foreground p-2">
                            Silakan login untuk klaim reward.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/40">
                        <div className="flex items-center gap-2 justify-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <Clock className="h-4 w-4 text-primary animate-pulse" />
                          <span>Poin akan aktif setelah target terpenuhi</span>
                        </div>
                        <p className="text-3xs text-muted-foreground mt-1 leading-relaxed">
                          Selesaikan membaca (scroll hingga 90% dan baca selama {targetReadingSeconds} detik) untuk mendapatkan +{article.points} LP.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

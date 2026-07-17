"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  ArrowLeft,
  Clock,
  Award,
  ShoppingBag,
  User,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeContent } from "@/types/api";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useVideoProgress } from "../hooks/use-video-progress";
import { useProgress } from "../hooks/use-progress";
import { useCompleteContent } from "../hooks/use-complete-content";
import { useClaimReward } from "../hooks/use-claim-reward";
import { authClient } from "@/lib/auth-client";
import { CommentsSection } from "./comments-section";

interface VideoDetailProps {
  video: KnowledgeContent;
}

export default function VideoDetail({ video }: VideoDetailProps) {
  const t = useTranslations("panduan");
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Fetch backend progress
  const {
    data: progress,
    isLoading: isProgressLoading,
    refetch: refetchProgress,
  } = useProgress(video.id, !!session);

  const completed = progress?.completed ?? false;
  const claimed = progress?.rewardClaimed ?? false;

  // Resolve whether video is streamed directly from Cloudinary or uses YouTube fallback
  const isCloudinary = video.secureUrl && video.secureUrl.startsWith("http");

  // 2. Local progress tracking
  const { watchedPercentage, meetsThreshold } = useVideoProgress({
    videoRef,
    videoDurationSeconds: video.duration
      ? parseInt(video.duration.split(":")[0]) * 60 +
        parseInt(video.duration.split(":")[1])
      : 300,
    completed,
    enabled: !!session,
  });

  const completeMutation = useCompleteContent();
  const claimMutation = useClaimReward();
  const [completeSent, setCompleteSent] = useState(false);

  // 3. Auto-submit completion once watched >= 80%
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
          contentId: video.id,
          payload: {
            watchedPercentage,
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
    watchedPercentage,
    video.id,
  ]);

  const handleClaim = () => {
    if (claimMutation.isPending) return;
    claimMutation.mutate(video.id, {
      onSuccess: () => {
        refetchProgress();
      },
    });
  };

  const handleYouTubeComplete = () => {
    // Fallback tracker for legacy YouTube videos
    if (completeMutation.isPending) return;
    completeMutation.mutate(
      {
        contentId: video.id,
        payload: {
          watchedPercentage: 80, // Mock 80%
        },
      },
      {
        onSuccess: () => {
          refetchProgress();
        },
      },
    );
  };

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      {/* Back Navigation */}
      <div className="mx-auto max-w-7xl px-4 pt-8 space-y-4">
        <Breadcrumbs
          items={[
            { label: "Panduan Tani", href: "/panduan-tani" },
            { label: "Video", href: "/panduan-tani" },
            { label: video.title },
          ]}
        />
        <button
          onClick={() => router.back()}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Panduan
        </button>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Video Content */}
          <div className={session ? "lg:col-span-8" : "lg:col-span-12 max-w-4xl mx-auto w-full"}>
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800/60 dark:bg-gray-900/50 backdrop-blur-xl">
              {/* Video Player */}
              <div className="relative aspect-video w-full bg-black group overflow-hidden">
                {isCloudinary ? (
                  <video
                    ref={videoRef}
                    src={video.secureUrl || ""}
                    controls
                    className="absolute inset-0 h-full w-full object-contain transition-transform duration-700"
                    poster={video.thumbnailUrl || video.imageUrl || ""}
                  />
                ) : video.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white bg-gray-900">
                    <p className="font-medium text-gray-400">Video tidak ditemukan.</p>
                  </div>
                )}
                
                {/* Optional subtle gradient overlay just at the top so it doesn't block player controls */}
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md border border-white/20">
                    {t("categoryLabel." + video.category?.toLowerCase())}
                  </span>
                  <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md border border-primary/20">
                    {t("difficultyLabel." + video.difficulty?.toLowerCase())}
                  </span>
                </div>
              </div>

              {/* Details & Info Section */}
              <div className="p-6 sm:p-10 lg:p-12">
                {/* Meta Info */}
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-gray-100 pb-6 dark:border-gray-800/60">
                  <span className="flex items-center gap-2 font-medium bg-gray-50 px-3 py-1.5 rounded-full dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <Clock className="h-4 w-4 text-primary" />
                    {video.duration} mnt
                  </span>
                  <span className="flex items-center gap-2 font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                    <Sparkles className="h-4 w-4 fill-current" />
                    +{video.points} LP Reward
                  </span>

                  {/* Point Status Tracker Inline */}
                  {session && (
                    <div className="ml-auto flex items-center lg:hidden">
                      {claimed ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/50">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Berhasil Didapat
                        </span>
                      ) : completed ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 animate-pulse border border-amber-200">
                          🎉 Siap Diklaim!
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                          ⚠️ {Math.round(watchedPercentage)}% / 80%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-8 tracking-tight">
                  {video.title}
                </h1>

                {/* Author/Uploader Card */}
                <div className="mb-10 inline-flex items-center gap-4 rounded-full border border-gray-100 bg-gray-50/50 pr-6 pl-2 py-2 dark:border-gray-800/60 dark:bg-gray-900/30 transition-all hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <img
                    src={
                      video.uploader.avatarUrl ||
                      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"
                    }
                    alt={video.uploader.name}
                    className="h-12 w-12 rounded-full object-cover shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium mb-0.5">
                      Diunggah oleh
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      {video.uploader.name}
                      {video.uploader.role === "Petani Ahli" && (
                        <Award className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Video Description & Transkrip / Key Points */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Deskripsi Praktik
                    </h3>
                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {video.content}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 dark:border-gray-800/60 dark:bg-gray-900/30">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
                      Transkrip & Poin-Poin Penting
                    </h3>
                    <ul className="list-disc pl-5 space-y-3 text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                      <li>
                        <strong className="text-gray-900 dark:text-gray-200">0:00 - 1:30</strong> — Pengenalan alat/bahan
                        penunjang yang dibutuhkan di lapangan.
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-gray-200">1:30 - 3:45</strong> — Tahap dekomposisi /
                        pengarangan dengan pembakaran ramah lingkungan.
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-gray-200">3:45 - 5:15</strong> — Teknik pencetakan padat
                        dan rasio campuran tapioka perekat.
                      </li>
                      <li>
                        <strong className="text-gray-900 dark:text-gray-200">5:15 - selesai</strong> — Penjemuran alami dan
                        panduan pengetesan kualitas daya bakar hasil akhir.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border border-emerald-100/60 p-8 sm:p-12 text-center dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900 dark:border-emerald-900/30 shadow-sm">
                  {/* Decorative background element */}
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/20"></div>
                  <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5"></div>
                  
                  <div className="relative z-10">
                    <h3 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Siap mempraktikkan isi video ini?
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
                      Beli perlengkapan pendukung atau cari alat tani bekas /
                      bahan baku organik di marketplace pertanian LoopTani.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 px-8 py-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        <Link href={`/marketplace`}>
                          <ShoppingBag className="h-5 w-5" />
                          Kunjungi Marketplace
                        </Link>
                      </Button>

                      {session && !isCloudinary && !completed && (
                        <Button
                          onClick={handleYouTubeComplete}
                          disabled={completeMutation.isPending}
                          size="lg"
                          className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold flex items-center justify-center gap-2 px-8 py-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        >
                          <Sparkles className="h-5 w-5 fill-current text-yellow-200" />
                          Tandai Selesai Menonton
                        </Button>
                      )}

                      {session && !claimed && (
                        <Button
                          onClick={handleClaim}
                          disabled={!completed || claimMutation.isPending}
                          size="lg"
                          className={`w-full sm:w-auto rounded-2xl font-bold flex items-center justify-center gap-2 px-8 py-6 transition-all duration-300 ${
                            completed
                              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
                          }`}
                        >
                          <Sparkles className={`h-5 w-5 ${completed ? "fill-current text-yellow-200 animate-pulse" : ""}`} />
                          {completed
                            ? "Klaim LoopPoints Sekarang"
                            : `Sedang Menonton (${Math.round(watchedPercentage)}%)`}
                        </Button>
                      )}

                      {session && claimed && (
                        <Button
                          disabled
                          size="lg"
                          className="w-full sm:w-auto rounded-2xl bg-emerald-50 text-emerald-700 font-bold border-emerald-200 border flex items-center justify-center gap-2 px-8 py-6 cursor-default opacity-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Tonton Selesai & Poin Diklaim
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/30 dark:bg-gray-900/20">
                <CommentsSection contentId={video.id} />
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Progress Widget */}
          {session && (
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80 dark:shadow-none relative overflow-hidden">
                  {/* Decorative blur */}
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800/60">
                      <h3 className="font-fraunces text-lg font-bold text-gray-900 dark:text-white">
                        Progress Menonton
                      </h3>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-sm dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                        <Sparkles className="h-5 w-5 fill-current" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Watching Progress */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
                            <circle
                              cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                              className={`transition-all duration-500 ease-out ${meetsThreshold ? "text-emerald-500" : "text-primary"}`}
                              strokeDasharray="251.32"
                              strokeDashoffset={251.32 - (Math.min(watchedPercentage / 80, 1)) * 251.32}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(watchedPercentage)}%</span>
                            <span className="text-xs text-muted-foreground font-medium">/ 80%</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm font-bold text-gray-700 dark:text-gray-300 text-center">Durasi Ditonton</p>
                      </div>

                      {/* Status Indicator */}
                      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/60 text-center">
                        {claimed ? (
                          <div className="rounded-2xl bg-emerald-50/80 p-5 border border-emerald-100/50 dark:bg-emerald-900/20 dark:border-emerald-800/30">
                            <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1">
                              <CheckCircle2 className="h-5 w-5" />
                              <span>Poin Telah Diklaim</span>
                            </div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500">
                              Anda berhasil mengumpulkan +{video.points} LP dari
                              panduan ini.
                            </p>
                          </div>
                        ) : completed ? (
                          <div className="space-y-4">
                            <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100/50 dark:bg-amber-900/20 dark:border-amber-800/30">
                              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                                🎉 Selamat! Selesai menonton.
                              </p>
                            </div>
                            <Button
                              onClick={handleClaim}
                              disabled={claimMutation.isPending}
                              size="lg"
                              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-6 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 animate-bounce"
                            >
                              <Sparkles className="mr-2 h-5 w-5 fill-current text-yellow-200" />
                              Klaim {video.points} LP
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700/50">
                              <div className="flex items-center gap-2 justify-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                <Clock className="h-4 w-4 text-primary animate-pulse" />
                                <span>Sedang Berjalan</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Tonton setidaknya <span className="font-bold text-gray-900 dark:text-gray-200">80% dari durasi video</span> untuk
                                mendapatkan +{video.points} LP.
                              </p>
                            </div>

                            {!isCloudinary && (
                              <Button
                                onClick={handleYouTubeComplete}
                                disabled={completeMutation.isPending}
                                className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 shadow-sm text-xs transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                Tandai Selesai Manual (Bypass)
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

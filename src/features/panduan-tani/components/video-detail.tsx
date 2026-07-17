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
  X,
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
  const [isTrackerOpen, setIsTrackerOpen] = useState(true);

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
    if (completeMutation.isPending) return;
    completeMutation.mutate(
      {
        contentId: video.id,
        payload: {
          watchedPercentage: 80,
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
    <div className="min-h-screen bg-white pb-24 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Top Banner Navigation */}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { label: "Panduan Tani", href: "/panduan-tani" },
            { label: "Video", href: "/panduan-tani" },
            { label: video.title },
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

      {/* Main Container */}
      <article className="mx-auto max-w-4xl px-4 mt-8">
        
        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black rounded-3xl border border-gray-150 dark:border-gray-800 shadow-lg overflow-hidden group mb-8">
          {isCloudinary ? (
            <video
              ref={videoRef}
              src={video.secureUrl || ""}
              controls
              className="h-full w-full object-contain"
              poster={video.thumbnailUrl || video.imageUrl || ""}
            />
          ) : video.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white bg-gray-900">
              <p className="font-medium text-gray-400">Video tidak ditemukan.</p>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Category & Difficulty Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary dark:bg-primary/20">
              {t("categoryLabel." + video.category?.toLowerCase())}
            </span>
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-bold text-gray-700 dark:text-gray-300">
              {t("difficultyLabel." + video.difficulty?.toLowerCase())}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-gray-900 dark:text-white tracking-tight">
            {video.title}
          </h1>

          {/* Meta Header */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-100 dark:border-gray-850">
            <img
              src={
                video.uploader.avatarUrl ||
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"
              }
              alt={video.uploader.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50 dark:ring-gray-850"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                {video.uploader.name}
                {video.uploader.role === "Petani Ahli" && (
                  <Award className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {video.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                  <Sparkles className="h-3.5 w-3.5 fill-current text-amber-500" />
                  +{video.points} LP Reward
                </span>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Deskripsi Praktik
              </h3>
              <p className="text-base leading-relaxed text-gray-800 dark:text-gray-250">
                {video.content}
              </p>
            </div>

            {/* Transcript Timeline */}
            <div className="rounded-3xl border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/20 p-6 sm:p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Transkrip & Poin-Poin Penting
              </h3>
              <ul className="list-none space-y-3.5 text-sm text-gray-700 dark:text-gray-350 leading-relaxed">
                <li className="flex gap-3">
                  <span className="font-bold text-primary bg-primary/10 rounded-lg px-2 py-0.5 h-fit text-xs min-w-16 text-center">0:00 - 1:30</span>
                  <span>Pengenalan alat/bahan penunjang yang dibutuhkan di lapangan.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary bg-primary/10 rounded-lg px-2 py-0.5 h-fit text-xs min-w-16 text-center">1:30 - 3:45</span>
                  <span>Tahap dekomposisi / pengarangan dengan pembakaran ramah lingkungan.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary bg-primary/10 rounded-lg px-2 py-0.5 h-fit text-xs min-w-16 text-center">3:45 - 5:15</span>
                  <span>Teknik pencetakan padat dan rasio campuran tapioka perekat.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary bg-primary/10 rounded-lg px-2 py-0.5 h-fit text-xs min-w-16 text-center">5:15 - selesai</span>
                  <span>Penjemuran alami dan panduan pengetesan kualitas daya bakar hasil akhir.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-12 relative overflow-hidden rounded-3xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 p-8 sm:p-10 text-center shadow-2xs">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"></div>
            
            <div className="relative z-10 space-y-4">
              <h3 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                Siap mempraktikkan isi video ini?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Beli perlengkapan pendukung atau cari alat tani bekas / bahan baku organik di marketplace pertanian LoopTani.
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
            <CommentsSection contentId={video.id} />
          </div>
        </div>

      </article>

      {/* Floating Progress Tracker Widget (Sticky in viewport, bottom-right) */}
      {session && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl transition-all duration-300 overflow-hidden ${
            isTrackerOpen ? "w-64 p-5 scale-100" : "w-14 h-14 flex items-center justify-center p-0 scale-95 hover:scale-100"
          }`}>
            {isTrackerOpen ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-850 pb-2">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Progress Menonton</h4>
                  <button onClick={() => setIsTrackerOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl">
                  <span className="text-[10px] text-muted-foreground block font-medium mb-1">Durasi Ditonton</span>
                  <span className={`text-base font-bold ${meetsThreshold ? "text-emerald-600" : "text-amber-600"}`}>
                    {Math.round(watchedPercentage)}% <span className="text-[10px] font-normal text-muted-foreground">/ 80%</span>
                  </span>
                </div>

                <div className="pt-2 text-center space-y-2">
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
                      Klaim {video.points} LP
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[10px] text-muted-foreground block leading-normal">
                        Tonton setidaknya 80% video untuk mendapatkan +{video.points} LP
                      </span>
                      {!isCloudinary && (
                        <Button
                          onClick={handleYouTubeComplete}
                          disabled={completeMutation.isPending}
                          variant="outline"
                          className="w-full py-2 h-auto text-[10px] rounded-xl font-bold transition-all cursor-pointer border-gray-200"
                        >
                          Tandai Selesai Manual (Bypass)
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="w-full h-full flex flex-col items-center justify-center text-primary cursor-pointer hover:bg-muted/10 relative"
                title="Buka Progress Menonton"
              >
                {/* Circular progress overlay */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform p-1" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="currentColor" strokeWidth="2.5" className="text-gray-150 dark:text-gray-850" />
                  <circle
                    cx="18" cy="18" r="14" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className="text-primary transition-all duration-300"
                    strokeDasharray="87.96"
                    strokeDashoffset={87.96 - (Math.min(watchedPercentage / 80, 1)) * 87.96}
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

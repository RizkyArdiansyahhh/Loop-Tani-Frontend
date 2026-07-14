"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowLeft, Clock, Award, ShoppingBag, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeContent } from "@/types/api";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useVideoProgress } from "../hooks/use-video-progress";
import { useProgress } from "../hooks/use-progress";
import { useCompleteContent } from "../hooks/use-complete-content";
import { useClaimReward } from "../hooks/use-claim-reward";
import { authClient } from "@/lib/auth-client";

interface VideoDetailProps {
  video: KnowledgeContent;
}

export default function VideoDetail({ video }: VideoDetailProps) {
  const t = useTranslations("panduan");
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Fetch backend progress
  const { data: progress, isLoading: isProgressLoading, refetch: refetchProgress } = useProgress(
    video.id,
    !!session
  );

  const completed = progress?.completed ?? false;
  const claimed = progress?.rewardClaimed ?? false;

  // Resolve whether video is streamed directly from Cloudinary or uses YouTube fallback
  const isCloudinary = video.secureUrl && video.secureUrl.startsWith("http");

  // 2. Local progress tracking
  const { watchedPercentage, meetsThreshold } = useVideoProgress({
    videoRef,
    videoDurationSeconds: video.duration ? (parseInt(video.duration.split(":")[0]) * 60 + parseInt(video.duration.split(":")[1])) : 300,
    completed,
  });

  const completeMutation = useCompleteContent();
  const claimMutation = useClaimReward();
  const [completeSent, setCompleteSent] = useState(false);

  // 3. Auto-submit completion once watched >= 80%
  useEffect(() => {
    if (session && meetsThreshold && !completed && !completeSent && !completeMutation.isPending) {
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
        }
      );
    }
  }, [session, meetsThreshold, completed, completeSent, watchedPercentage, video.id]);

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
      }
    );
  };

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      {/* Back Navigation */}
      <div className="mx-auto max-w-6xl px-4 pt-8 space-y-4">
        <Breadcrumbs
          items={[
            { label: "Panduan Tani", href: "/panduan-tani" },
            { label: "Video", href: "/panduan-tani" },
            { label: video.title },
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
          {/* Left Column: Video Content */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
          
          {/* Video Player */}
          <div className="relative aspect-video w-full bg-black">
            {isCloudinary ? (
              <video
                ref={videoRef}
                src={video.secureUrl || ""}
                controls
                className="absolute inset-0 h-full w-full object-contain"
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
              <div className="flex h-full w-full items-center justify-center text-white">
                <p>Video tidak ditemukan.</p>
              </div>
            )}
          </div>

          {/* Details & Info Section */}
          <div className="p-6 sm:p-10">
            {/* Meta Info */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-b border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Durasi: {video.duration} menit
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-4 w-4 fill-current" />
                  +{video.points} LP Reward
                </span>
              </div>

              {/* Point Status Tracker */}
              {claimed ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Reward LP Berhasil Didapat
                </span>
              ) : completed ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-2xs font-bold text-amber-800 animate-pulse">
                  🎉 Menonton selesai! Silakan klaim poin di bawah.
                </span>
              ) : session ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-2xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  ⚠️ Ditonton: {Math.round(watchedPercentage)}/80% untuk +{video.points} LP
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-2xs font-semibold text-gray-500">
                  Masuk untuk mengumpulkan LoopPoints
                </span>
              )}
            </div>

            {/* Title - Custom FRAUNCES font */}
            <h1 className="font-fraunces text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
              {video.title}
            </h1>

            {/* Author/Uploader Card */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/40">
              <img
                src={video.uploader.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"}
                alt={video.uploader.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-2xs text-muted-foreground leading-none mb-1">
                  {t("uploadBy")}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  {video.uploader.name}
                  {video.uploader.role === "Petani Ahli" && (
                    <Award className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                  )}
                </span>
                <span className="text-3xs text-muted-foreground leading-none">
                  {video.uploader.role}
                </span>
              </div>
            </div>

            {/* Video Description & Transkrip / Key Points */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Deskripsi Praktik
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {video.content}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-950/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Transkrip & Poin-Poin Penting
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <li><strong>0:00 - 1:30</strong> — Pengenalan alat/bahan penunjang yang dibutuhkan di lapangan.</li>
                  <li><strong>1:30 - 3:45</strong> — Tahap dekomposisi / pengarangan dengan pembakaran ramah lingkungan.</li>
                  <li><strong>3:45 - 5:15</strong> — Teknik pencetakan padat dan rasio campuran tapioka perekat.</li>
                  <li><strong>5:15 - selesai</strong> — Penjemuran alami dan panduan pengetesan kualitas daya bakar hasil akhir.</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-10 rounded-3xl bg-radial from-emerald-50 to-white border border-emerald-100/50 p-6 sm:p-8 text-center dark:from-emerald-950/10 dark:to-gray-900 dark:border-emerald-900/20">
              <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white mb-2">
                Siap mempraktikkan isi video ini?
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
                Beli perlengkapan pendukung atau cari alat tani bekas / bahan baku organik di marketplace pertanian LoopTani.
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

                {session && !isCloudinary && !completed && (
                  <Button
                    onClick={handleYouTubeComplete}
                    disabled={completeMutation.isPending}
                    className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 px-6 py-5 shadow-sm"
                  >
                    <Sparkles className="h-4 w-4 fill-current text-yellow-200" />
                    Tandai Selesai Menonton
                  </Button>
                )}

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
                    <Sparkles className="h-4 w-4 fill-current text-yellow-300" />
                    Klaim LoopPoints
                  </Button>
                )}

                {session && claimed && (
                  <Button
                    disabled
                    className="w-full sm:w-auto rounded-xl bg-emerald-50 text-emerald-700 font-semibold border-emerald-150 border flex items-center justify-center gap-2 px-6 py-5 cursor-default opacity-100 dark:bg-emerald-950/20 dark:text-emerald-400"
                  >
                    ✓ Tonton Selesai & Poin Diklaim
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
                  Progress Menonton
                </h3>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                  <Sparkles className="h-4.5 w-4.5 fill-current animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Watching Progress */}
                <div>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Durasi Ditonton</span>
                    <span className="font-bold text-primary">{Math.round(watchedPercentage)}% / 80%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        meetsThreshold ? "bg-emerald-500" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(watchedPercentage / 0.8, 100)}%` }}
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
                        Anda berhasil mengumpulkan +{video.points} LP dari panduan ini.
                      </p>
                    </div>
                  ) : completed ? (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/20">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          🎉 Selamat! Selesai menonton.
                        </p>
                      </div>
                      {session ? (
                        <Button
                          onClick={handleClaim}
                          disabled={claimMutation.isPending}
                          className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
                        >
                          <Sparkles className="mr-2 h-4 w-4 fill-current text-yellow-205" />
                          Klaim {video.points} LP Sekarang
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground p-2">
                          Silakan login untuk klaim reward.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/40">
                        <div className="flex items-center gap-2 justify-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <Clock className="h-4 w-4 text-primary animate-pulse" />
                          <span>Poin aktif setelah tontonan 80%</span>
                        </div>
                        <p className="text-3xs text-muted-foreground mt-1 leading-relaxed">
                          Tonton setidaknya 80% dari durasi video untuk mendapatkan +{video.points} LP.
                        </p>
                      </div>

                      {session && !isCloudinary && (
                        <Button
                          onClick={handleYouTubeComplete}
                          disabled={completeMutation.isPending}
                          className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 shadow-sm text-xs"
                        >
                          <Sparkles className="mr-2 h-3.5 w-3.5 fill-current text-yellow-205" />
                          Tandai Selesai Menonton
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
    </div>
  </article>
  );
}

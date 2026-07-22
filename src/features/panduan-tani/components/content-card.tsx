"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Play, Sparkles, Clock, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { KnowledgeContent } from "@/types/api";
import { authClient } from "@/lib/auth-client";

interface ContentCardProps {
  content: KnowledgeContent;
}

export function ContentCard({ content }: ContentCardProps) {
  const t = useTranslations("panduan");
  const { data: session } = authClient.useSession();
  const [imageError, setImageError] = useState(false);

  // Setup thumbnail image
  let thumbnailUrl = content.thumbnailUrl || content.imageUrl;
  if (content.type === "video" && content.youtubeId && !thumbnailUrl) {
    thumbnailUrl = imageError
      ? `https://img.youtube.com/vi/${content.youtubeId}/hqdefault.jpg`
      : `https://img.youtube.com/vi/${content.youtubeId}/maxresdefault.jpg`;
  }

  if (!thumbnailUrl) {
    thumbnailUrl = `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=400&q=80`;
  }

  const detailUrl =
    content.type === "artikel"
      ? `/panduan-tani/artikel/${content.slug}`
      : `/panduan-tani/video/${content.slug}`;

  // Content snippet for article list layout
  const summarySnippet = content.content
    ? content.content.replace(/[#*`_-]/g, "").slice(0, 140) + "..."
    : "";

  if (content.type === "artikel") {
    // -------------------------------------------------------------
    // MEDIUM-STYLE HORIZONTAL LIST LAYOUT FOR ARTICLES
    // -------------------------------------------------------------
    return (
      <Link
        href={detailUrl}
        className="group flex items-start justify-between gap-6 py-6 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 px-4 rounded-3xl transition-all duration-300"
      >
        {/* Left Side: Article Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full min-h-[110px] md:min-h-[130px]">
          <div>
            {/* Top Meta: Author & Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2 text-2xs md:text-xs">
              {content.uploader.avatarUrl ? (
                <img
                  src={content.uploader.avatarUrl}
                  alt={content.uploader.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-3 w-3" />
                </div>
              )}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {content.uploader.name}
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-0 font-semibold px-2 py-0.5 rounded-lg text-[10px]">
                {t("categoryLabel." + content.category?.toLowerCase())}
              </Badge>
              <Badge variant="secondary" className="font-semibold px-2 py-0.5 rounded-lg text-[10px] bg-gray-100 text-gray-600 dark:bg-gray-850 dark:text-gray-400">
                {t("difficultyLabel." + content.difficulty?.toLowerCase())}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-fraunces text-base md:text-xl font-bold leading-snug text-gray-900 group-hover:text-primary dark:text-gray-100 transition-colors duration-350 mb-1 md:mb-1.5">
              {content.title}
            </h3>

            {/* Summary Snippet */}
            <p className="hidden sm:block text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {summarySnippet}
            </p>
          </div>

          {/* Bottom Footer Info */}
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-2xs md:text-xs text-muted-foreground font-medium">
              <BookOpen className="h-3.5 w-3.5" />
              {t("readDuration", {
                duration: content.duration.replace(" baca", ""),
              })}
            </span>

            {/* Reward Points */}
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-[10px] md:text-xs font-semibold text-amber-700 dark:text-amber-400 ring-1 ring-amber-600/10">
              <Sparkles className="h-3 w-3 fill-current text-amber-500" />
              <span>
                {session
                  ? t("pointsReward", { points: content.points })
                  : t("pointsRewardLocked", { points: content.points })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Square Thumbnail */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 bg-muted shadow-2xs">
          <img
            src={thumbnailUrl}
            alt={content.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
    );
  }

  // -------------------------------------------------------------
  // MODERN GRID CARD LAYOUT FOR VIDEOS
  // -------------------------------------------------------------
  return (
    <Link
      href={detailUrl}
      className="group flex flex-col h-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xs transition-all duration-350 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Media Cover / Image Section */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={content.title}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <Badge className="bg-white/95 text-gray-900 shadow-2xs backdrop-blur-xs font-semibold hover:bg-white border-0 dark:bg-gray-850 dark:text-white text-[10px] px-2 py-0.5 rounded-lg">
            {t("categoryLabel." + content.category?.toLowerCase())}
          </Badge>
          <Badge className="bg-primary/90 text-white shadow-2xs backdrop-blur-xs font-semibold hover:bg-primary border-0 text-[10px] px-2 py-0.5 rounded-lg">
            {t("difficultyLabel." + content.difficulty?.toLowerCase())}
          </Badge>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/35">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-gray-900/95">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Video Duration Badge */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-2xs flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {t("videoDuration", { duration: content.duration })}
        </div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Points & Type */}
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 ring-1 ring-amber-600/10">
            <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse text-amber-500" />
            <span>
              {session
                ? t("pointsReward", { points: content.points })
                : t("pointsRewardLocked", { points: content.points })}
            </span>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Video
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 line-clamp-2 text-sm md:text-base font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors duration-300 dark:text-gray-100 min-h-10 md:min-h-12">
          {content.title}
        </h3>

        <div className="flex-1" />

        {/* Separator */}
        <div className="my-3.5 h-px w-full bg-gray-100 dark:bg-gray-800" />

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {content.uploader.avatarUrl ? (
              <img
                src={content.uploader.avatarUrl}
                alt={content.uploader.name}
                className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {content.uploader.name}
              </span>
              <span className="text-[10px] text-muted-foreground leading-none">
                {content.uploader.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

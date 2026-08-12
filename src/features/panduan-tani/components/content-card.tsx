import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Play, Award, Clock, BookOpen, User } from "lucide-react";
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
        className="group flex items-start justify-between gap-6 py-5 border-b border-gray-100 dark:border-gray-800/80 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-900/30 px-3 md:px-4 rounded-2xl transition-all duration-200 font-poppins"
      >
        {/* Left Side: Article Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full min-h-[100px] md:min-h-[120px]">
          <div>
            {/* Top Meta: Author & Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2 text-2xs md:text-xs font-poppins">
              {content.uploader.avatarUrl ? (
                <img
                  src={content.uploader.avatarUrl}
                  alt={content.uploader.name}
                  className="h-4.5 w-4.5 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-800"
                />
              ) : (
                <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-3 w-3" />
                </div>
              )}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {content.uploader.name}
              </span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-0 font-medium px-2 py-0.5 rounded-md text-[10px] dark:bg-emerald-950/50 dark:text-emerald-300">
                {t("categoryLabel." + content.category?.toLowerCase())}
              </Badge>
              <Badge variant="secondary" className="font-medium px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-600 dark:bg-gray-850 dark:text-gray-400">
                {t("difficultyLabel." + content.difficulty?.toLowerCase())}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-poppins text-base md:text-lg font-bold leading-snug text-gray-900 group-hover:text-emerald-700 dark:text-gray-100 dark:group-hover:text-emerald-400 transition-colors duration-200 mb-1">
              {content.title}
            </h3>

            {/* Summary Snippet */}
            <p className="hidden sm:block text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {summarySnippet}
            </p>
          </div>

          {/* Bottom Footer Info */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-2xs md:text-xs text-muted-foreground font-medium">
              <BookOpen className="h-3.5 w-3.5" />
              {t("readDuration", {
                duration: content.duration.replace(" baca", ""),
              })}
            </span>

            {/* Reward Points */}
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50/80 dark:bg-amber-950/30 px-2.5 py-0.5 text-[10px] md:text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
              <Award className="h-3 w-3 text-amber-500" />
              <span>
                {session
                  ? t("pointsReward", { points: content.points })
                  : t("pointsRewardLocked", { points: content.points })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Thumbnail */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800 bg-muted shadow-2xs">
          <img
            src={thumbnailUrl}
            alt={content.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      className="group flex flex-col h-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 dark:hover:border-emerald-900/40 dark:border-gray-800 dark:bg-gray-900 font-poppins"
    >
      {/* Media Cover / Image Section */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={content.title}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10 font-poppins">
          <Badge className="bg-white/95 text-gray-800 shadow-2xs backdrop-blur-xs font-semibold hover:bg-white border-0 dark:bg-gray-900 dark:text-white text-[10px] px-2 py-0.5 rounded-lg">
            {t("categoryLabel." + content.category?.toLowerCase())}
          </Badge>
          <Badge className="bg-emerald-700/90 text-white shadow-2xs backdrop-blur-xs font-semibold hover:bg-emerald-700 border-0 text-[10px] px-2 py-0.5 rounded-lg">
            {t("difficultyLabel." + content.difficulty?.toLowerCase())}
          </Badge>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors duration-300 group-hover:bg-black/25">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-emerald-700 shadow-md transition-transform duration-300 group-hover:scale-105 dark:bg-gray-900/95 dark:text-emerald-400">
            <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Video Duration Badge */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-2xs flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {t("videoDuration", { duration: content.duration })}
        </div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Points & Type */}
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
            <Award className="h-3.5 w-3.5 text-amber-500" />
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
        <h3 className="mb-4 line-clamp-2 text-sm md:text-base font-bold leading-snug text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 dark:text-gray-100 dark:group-hover:text-emerald-400 min-h-10 md:min-h-12 font-poppins">
          {content.title}
        </h3>

        <div className="flex-1" />

        {/* Separator */}
        <div className="my-3 h-px w-full bg-gray-100 dark:bg-gray-800" />

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {content.uploader.avatarUrl ? (
              <img
                src={content.uploader.avatarUrl}
                alt={content.uploader.name}
                className="h-6.5 w-6.5 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
              />
            ) : (
              <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-3.5 w-3.5" />
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

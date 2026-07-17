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
    // If it's a video and has a youtubeId, use the YouTube high quality thumbnail
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

  return (
    <Link
      href={detailUrl}
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
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

        {/* Difficulty Badge - Absolute */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <Badge
            variant={
              content.difficulty?.toLowerCase() === "pemula"
                ? "secondary"
                : "default"
            }
            className="bg-white/95 text-gray-900 shadow-xs backdrop-blur-xs font-semibold hover:bg-white border-0 dark:bg-gray-800/90 dark:text-white"
          >
            {t("difficultyLabel." + content.difficulty?.toLowerCase())}
          </Badge>
          <Badge className="bg-primary/90 text-white shadow-xs backdrop-blur-xs font-semibold hover:bg-primary border-0">
            {t("categoryLabel." + content.category?.toLowerCase())}
          </Badge>
        </div>

        {/* Video Overlay Icon */}
        {content.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-300 group-hover:bg-black/45">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-gray-900/90">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>
        )}

        {/* Floating duration badge bottom right */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/65 px-2 py-0.5 text-2xs font-medium text-white backdrop-blur-2xs flex items-center gap-1">
          {content.type === "artikel" ? (
            <BookOpen className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {content.type === "artikel"
            ? t("readDuration", {
                duration: content.duration.replace(" baca", ""),
              })
            : t("videoDuration", { duration: content.duration })}
        </div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Sparkles Point Reward - Highlighted */}
        <div className="mb-2.5 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/10 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-500/20">
            <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse text-amber-500" />
            <span>
              {session
                ? t("pointsReward", { points: content.points })
                : t("pointsRewardLocked", { points: content.points })}
            </span>
          </div>
          <span className="text-3xs text-muted-foreground uppercase tracking-widest font-semibold">
            {content.type === "artikel" ? "Artikel" : "Video"}
          </span>
        </div>

        {/* Card Title - Strict line clamp and min-height to fix alignment */}
        <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-primary transition-colors duration-300 dark:text-gray-100 min-h-11">
          {content.title}
        </h3>

        {/* Spacer to push metadata to the bottom */}
        <div className="flex-1" />

        {/* Separator line */}
        <div className="my-3.5 h-px w-full bg-gray-100 dark:bg-gray-800" />

        {/* Uploader / Author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {content.uploader.avatarUrl ? (
              <img
                src={content.uploader.avatarUrl}
                alt={content.uploader.name}
                className="h-7 w-7 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-gray-100 dark:ring-gray-800">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {content.uploader.name}
              </span>
              <span className="text-4xs text-muted-foreground leading-none">
                {content.uploader.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

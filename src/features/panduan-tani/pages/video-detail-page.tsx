"use client";

import React from "react";
import VideoDetail from "../components/video-detail";
import { useContent } from "../hooks/use-content";

interface VideoDetailPageProps {
  slug: string;
}

export default function VideoDetailPage({ slug }: VideoDetailPageProps) {
  // Fetch video details dynamically from backend API using slug
  const { data: video, isLoading, isError } = useContent(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-6 dark:bg-gray-950">
        <h2 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Video Tidak Ditemukan
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Panduan video praktik yang Anda cari tidak tersedia atau telah dihapus.
        </p>
      </div>
    );
  }

  return <VideoDetail video={video} />;
}

"use client";

import React, { useEffect, useState } from "react";
import ArticleDetail from "../components/article-detail";
import { initialPanduanContents, PanduanContent } from "../lib/dummy-data";

interface ArticleDetailPageProps {
  slug: string;
}

export default function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<PanduanContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load contents from localStorage to support newly uploaded custom articles
    const storedContents = localStorage.getItem("looptani_contents");
    let contentList = initialPanduanContents;
    if (storedContents !== null) {
      try {
        contentList = JSON.parse(storedContents);
      } catch (e) {
        console.error(e);
      }
    }

    const foundArticle = contentList.find(
      (item) => item.type === "artikel" && item.slug === slug
    );
    setArticle(foundArticle || null);
    setLoading(false);
  }, [slug]);

  const handleEarnPoints = (amount: number) => {
    const storedPoints = localStorage.getItem("looptani_points");
    const currentPoints = storedPoints !== null ? Number(storedPoints) : 350;
    const nextPoints = currentPoints + amount;
    localStorage.setItem("looptani_points", String(nextPoints));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-6 dark:bg-gray-950">
        <h2 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Artikel Tidak Ditemukan
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Panduan artikel yang Anda cari tidak tersedia atau telah dihapus.
        </p>
      </div>
    );
  }

  return <ArticleDetail article={article} onEarnPoints={handleEarnPoints} />;
}

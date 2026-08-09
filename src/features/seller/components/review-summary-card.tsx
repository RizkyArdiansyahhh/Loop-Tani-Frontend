"use client";

import { useTranslations } from "next-intl";
import type { SellerReviewsSummary } from "../api/get-seller-reviews";
import { ThumbsUp, MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react";

interface ReviewSummaryCardProps {
  summary: SellerReviewsSummary;
}

export function ReviewSummaryCard({ summary }: ReviewSummaryCardProps) {
  const t = useTranslations("seller.reviews.summary");

  const { averageRating, totalReviews, satisfactionRate, ratingBreakdown } = summary;

  return (
    <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-xs font-poppins">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <ThumbsUp className="w-4.5 h-4.5 text-primary" />
          <span>{t("title")}</span>
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {t("totalReviews", { count: totalReviews })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Rating Score */}
        <div className="flex flex-col items-center justify-center p-4 bg-muted/30 border border-border/60 rounded-2xl text-center space-y-1">
          <span className="text-4xl font-extrabold font-mono text-foreground tracking-tight">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground font-semibold">
            {t("averageRating")} (Skor 5.0)
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reputasi Sangat Baik</span>
          </div>
        </div>

        {/* Satisfaction Rate */}
        <div className="flex flex-col items-center justify-center p-4 bg-muted/30 border border-border/60 rounded-2xl text-center space-y-1">
          <span className="text-4xl font-extrabold font-mono text-primary tracking-tight">
            {satisfactionRate}
          </span>
          <span className="text-xs text-muted-foreground font-semibold">
            {t("satisfactionRate")}
          </span>
          <p className="text-[10px] text-muted-foreground pt-1">
            Persentase ulasan positif dari pembeli
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = ratingBreakdown[score as keyof typeof ratingBreakdown] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={score} className="flex items-center gap-2">
                <span className="w-12 text-[11px] font-bold font-mono text-muted-foreground">
                  Skor {score}
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[10px] font-bold font-mono text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSellerReviews } from "../hooks/use-seller-reviews";
import { ReviewSummaryCard } from "../components/review-summary-card";
import { ReviewCard } from "../components/review-card";
import { ReplyModal } from "../components/reply-modal";
import type { SellerReview } from "../api/get-seller-reviews";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw } from "lucide-react";

export function SellerReviewsPage() {
  const t = useTranslations("seller.reviews");
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [selectedReview, setSelectedReview] = useState<SellerReview | null>(null);

  const { data: response, isLoading, isFetching, refetch } = useSellerReviews(selectedRating);

  const summary = response?.summary || {
    averageRating: 5.0,
    totalReviews: 0,
    satisfactionRate: "100%",
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  const reviews = response?.reviews || [];

  return (
    <div className="space-y-6 font-sans">
      {/* ── HEADER HALAMAN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-poppins">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground pt-0.5">
            {t("description")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 px-3.5 rounded-xl text-xs font-bold gap-2 cursor-pointer border-border/60 font-poppins self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
          <span>{t("refresh")}</span>
        </Button>
      </div>

      {/* ── SUMMARY CARD ── */}
      {isLoading ? (
        <div className="h-44 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
      ) : (
        <ReviewSummaryCard summary={summary} />
      )}

      {/* ── FILTER TABS BAR ── */}
      <div className="bg-card border border-border/70 p-3 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none font-poppins shadow-xs">
        {[
          { id: undefined, label: t("tabs.all") },
          { id: 5, label: t("tabs.star5") },
          { id: 4, label: t("tabs.star4") },
          { id: 3, label: t("tabs.star3") },
          { id: 2, label: t("tabs.star2") },
          { id: 1, label: t("tabs.star1") },
        ].map((tab) => (
          <button
            key={tab.id ?? "all"}
            onClick={() => setSelectedRating(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedRating === tab.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── REVIEWS LIST ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-2xl p-12 text-center space-y-3 font-poppins">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">{t("emptyTitle")}</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {t("emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReply={(rev) => setSelectedReview(rev)}
            />
          ))}
        </div>
      )}

      {/* ── REPLY MODAL DIALOG ── */}
      <ReplyModal
        review={selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
      />
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import type { SellerReview } from "../api/get-seller-reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Package, User, CheckCircle2 } from "lucide-react";

interface ReviewCardProps {
  review: SellerReview;
  onReply: (review: SellerReview) => void;
}

export function ReviewCard({ review, onReply }: ReviewCardProps) {
  const t = useTranslations("seller.reviews.card");

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-xs hover:border-primary/40 transition-all font-sans">
      {/* Header: Buyer Avatar, Name, Rating & Date */}
      <div className="flex items-start justify-between gap-3 font-poppins">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-primary/20">
            {review.buyerAvatar ? (
              <img src={review.buyerAvatar} alt={review.buyerName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-foreground">{review.buyerName}</h4>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold font-mono px-2 py-0">
                Skor Kepuasan {review.rating}.0 / 5.0
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono block">
              {formatDate(review.createdAt)} • {t("orderNumber", { orderNumber: review.orderNumber })}
            </span>
          </div>
        </div>

        {!review.sellerReply && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReply(review)}
            className="h-8 px-3 rounded-xl text-xs font-bold gap-1.5 border-border/60 cursor-pointer font-poppins shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t("replyButton")}</span>
          </Button>
        )}
      </div>

      {/* Product Title Badge */}
      <div className="flex items-center gap-2 bg-muted/30 border border-border/60 p-2.5 rounded-xl text-xs font-poppins">
        <Package className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground shrink-0">{t("productTitle")}</span>
        <span className="font-bold text-foreground truncate">{review.productTitle}</span>
      </div>

      {/* Buyer Comment */}
      <p className="text-xs text-foreground leading-relaxed font-poppins">
        "{review.comment}"
      </p>

      {/* Seller Existing Reply Box */}
      {review.sellerReply && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 space-y-1 font-poppins">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-primary flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("sellerReplyTitle")}
            </span>
            <span className="text-muted-foreground text-[10px] font-mono">
              {formatDate(review.sellerReply.createdAt)}
            </span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed pt-0.5">
            {review.sellerReply.content}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useReplySellerReview } from "../hooks/use-reply-seller-review";
import type { SellerReview } from "../api/get-seller-reviews";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";

interface ReplyModalProps {
  review: SellerReview | null;
  onOpenChange: (open: boolean) => void;
}

export function ReplyModal({ review, onOpenChange }: ReplyModalProps) {
  const t = useTranslations("seller.reviews.modal");
  const [replyText, setReplyText] = useState("");
  const replyMutation = useReplySellerReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review) return;
    if (!replyText.trim() || replyText.trim().length < 3) {
      toast.error("Balasan ulasan minimal 3 karakter");
      return;
    }

    replyMutation.mutate(
      { reviewId: review.id, payload: { reply: replyText.trim() } },
      {
        onSuccess: (res) => {
          toast.success(res.message || t("toastSuccess"));
          onOpenChange(false);
          setReplyText("");
        },
        onError: () => {
          toast.error(t("toastError"));
        },
      }
    );
  };

  return (
    <Dialog open={!!review} onOpenChange={onOpenChange}>
      {review && (
        <DialogContent className="max-w-md rounded-2xl p-6 font-sans border-border/80">
          <DialogHeader className="border-b border-border/40 pb-3">
            <DialogTitle className="text-base font-bold font-poppins flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>{t("title")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2 font-poppins">
            {/* Buyer Comment Summary */}
            <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{review.buyerName}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Skor {review.rating}.0 / 5.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed pt-0.5">
                "{review.comment}"
              </p>
            </div>

            {/* Reply Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="reply-text" className="text-xs font-semibold text-foreground">
                {t("replyLabel")}
              </label>
              <Textarea
                id="reply-text"
                placeholder={t("replyPlaceholder")}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="text-xs rounded-xl min-h-24 border-border/60 leading-relaxed font-sans"
              />
            </div>

            <DialogFooter className="border-t border-border/40 pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 rounded-xl text-xs font-bold border-border/60 cursor-pointer"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={replyMutation.isPending || replyText.trim().length < 3}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
              >
                {replyMutation.isPending ? t("submitting") : t("submit")}
                <Send className="w-3.5 h-3.5" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

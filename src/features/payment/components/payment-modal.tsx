"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  PAYMENT_CHANNELS,
  PaymentChannelOption,
  PaymentRequestResponse,
  PaymentAction,
} from "../types/payment.type";
import { useCreatePaymentRequest, usePaymentByOrderId } from "../hooks/use-payment";
import { useRouter } from "@/i18n/navigation";
import {
  QrCode,
  Building2,
  Wallet,
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowRight,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  paymentId: string;
  amount: number;
  orderNumber: string;
}

export function PaymentModal({
  isOpen,
  onOpenChange,
  orderId,
  paymentId,
  amount,
  orderNumber,
}: PaymentModalProps) {
  const t = useTranslations("checkout.paymentModal");
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<
    "VIRTUAL_ACCOUNT" | "QRIS" | "EWALLET" | "PAYLATER"
  >("VIRTUAL_ACCOUNT");

  const [selectedChannel, setSelectedChannel] = useState<PaymentChannelOption>(
    PAYMENT_CHANNELS[0],
  );

  const [paymentRequest, setPaymentRequest] =
    useState<PaymentRequestResponse | null>(null);

  const [isCopied, setIsCopied] = useState(false);

  // Mutations & Query
  const createRequestMutation = useCreatePaymentRequest();
  const { data: paymentDetail } = usePaymentByOrderId(orderId, isOpen);

  // Auto-detect if payment succeeded via Webhook polling
  const isPaid =
    paymentDetail?.status === "SUCCEEDED" ||
    paymentRequest?.paymentStatus === "SUCCEEDED";

  useEffect(() => {
    if (isPaid) {
      toast.success(t("successOverlay.title"));
      const timer = setTimeout(() => {
        onOpenChange(false);
        router.push(`/profile/orders/${orderId}`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPaid, orderId, onOpenChange, router, t]);

  // Handle Requesting Payment Session
  const handleGeneratePayment = (channel: PaymentChannelOption) => {
    setSelectedChannel(channel);
    createRequestMutation.mutate(
      {
        paymentId,
        payload: {
          channelCode: channel.code,
        },
      },
      {
        onSuccess: (data) => {
          setPaymentRequest(data);
          toast.success(`${channel.name}`);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            "Gagal membuat sesi pembayaran. Silakan coba lagi.";
          toast.error(msg);
        },
      },
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success(`${label} ${t("va.copied")}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredChannels = PAYMENT_CHANNELS.filter(
    (ch) => ch.category === selectedCategory,
  );

  // Extract Action Items (QRIS or Redirect URL)
  const mainAction: PaymentAction | undefined =
    paymentRequest?.actions?.find(
      (act) => act.action === "PRESENT_TO_CUSTOMER" || act.action === "REDIRECT",
    ) || paymentRequest?.actions?.[0];

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card border border-border/80 shadow-2xl rounded-3xl font-sans">
        {/* Solid Top Header Card - NO GRADIENT */}
        <div className="bg-primary text-primary-foreground p-6 relative space-y-3 font-poppins">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary-foreground/90">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold tracking-wider uppercase font-mono">
                {t("encryptedTitle")}
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/20 text-[10px] font-bold font-mono px-2.5 py-0.5"
            >
              {t("orderNumber", { orderNumber })}
            </Badge>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-xs text-primary-foreground/80 font-medium block">
              {t("totalAmountLabel")}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-primary-foreground tracking-tight">
              {formattedAmount}
            </div>
          </div>

          <div className="absolute right-6 bottom-5 opacity-10 pointer-events-none">
            <ShieldCheck className="w-24 h-24 text-primary-foreground" />
          </div>
        </div>

        {/* Paid Success Overlay Animation */}
        {isPaid ? (
          <div className="p-8 text-center space-y-4 font-poppins">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {t("successOverlay.title")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {t("successOverlay.description")}
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-primary animate-pulse flex items-center justify-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{t("successOverlay.redirecting")}</span>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 font-poppins">
            {/* Category Filter Pills */}
            <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-muted/40 rounded-2xl border border-border/60">
              {[
                { id: "VIRTUAL_ACCOUNT", label: t("category.va"), icon: Building2 },
                { id: "QRIS", label: t("category.qris"), icon: QrCode },
                { id: "EWALLET", label: t("category.ewallet"), icon: Wallet },
                { id: "PAYLATER", label: t("category.paylater"), icon: CreditCard },
              ].map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      const firstInCat = PAYMENT_CHANNELS.find((c) => c.category === cat.id);
                      if (firstInCat) setSelectedChannel(firstInCat);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-card text-primary shadow-xs border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Channels List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                {t("selectChannelTitle")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredChannels.map((channel) => {
                  const isSelected = selectedChannel.code === channel.code;

                  return (
                    <button
                      key={channel.code}
                      type="button"
                      onClick={() => handleGeneratePayment(channel)}
                      disabled={createRequestMutation.isPending}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border/60 hover:border-primary/40 bg-card"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-foreground">
                          {channel.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {channel.description}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/60"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Display Area (QR Code or Copyable VA) */}
            {paymentRequest && (
              <div className="bg-muted/30 p-4.5 rounded-2xl border border-border/70 space-y-3.5 animate-in fade-in duration-300">
                {/* QRIS Render */}
                {selectedCategory === "QRIS" && (
                  <div className="text-center space-y-3">
                    <span className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4 text-primary" />
                      {t("qris.scanTitle")}
                    </span>
                    <div className="bg-white p-3.5 inline-block rounded-2xl shadow-xs border border-border/60">
                      {mainAction?.qr_code ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            mainAction.qr_code,
                          )}`}
                          alt="QRIS Payment Code"
                          className="w-44 h-44 mx-auto rounded-xl"
                        />
                      ) : (
                        <div className="w-44 h-44 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded-xl">
                          Simulasi QRIS Sandbox
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                      {t("qris.instructions")}
                    </p>
                  </div>
                )}

                {/* Virtual Account Render */}
                {selectedCategory === "VIRTUAL_ACCOUNT" && (
                  <div className="space-y-2 font-poppins">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t("va.vaNumberLabel", { bank: selectedChannel.name })}</span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {t("va.timeLimit")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-card border border-border/70 rounded-xl font-mono text-sm font-bold text-foreground">
                      <span>
                        {paymentRequest.referenceId.replace("PAY-", "88390")}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleCopy(
                            paymentRequest.referenceId.replace("PAY-", "88390"),
                            selectedChannel.name,
                          )
                        }
                        className="h-8 text-xs font-bold gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {isCopied ? t("va.copied") : t("va.copy")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* E-Wallet / Redirect Render */}
                {(selectedCategory === "EWALLET" || selectedCategory === "PAYLATER") && (
                  <div className="text-center space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {t("ewallet.redirectHint", { channel: selectedChannel.name })}
                    </p>
                    {mainAction?.url ? (
                      <Button
                        type="button"
                        asChild
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-xl font-bold text-xs gap-2 cursor-pointer shadow-xs"
                      >
                        <a
                          href={mainAction.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("ewallet.openBtn", { channel: selectedChannel.name })}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl font-bold">
                        {t("ewallet.readyHint", { channel: selectedChannel.name })}
                      </div>
                    )}
                  </div>
                )}

                {/* Polling Indicator */}
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground border-t border-border/40 font-poppins">
                  <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                  <span>{t("actions.polling")}</span>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs font-bold h-9 px-4 rounded-xl border-border/60 cursor-pointer"
              >
                {t("actions.closePayLater")}
              </Button>

              {!paymentRequest && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleGeneratePayment(selectedChannel)}
                  disabled={createRequestMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold h-9 px-5 rounded-xl gap-1.5 cursor-pointer shadow-xs"
                >
                  {createRequestMutation.isPending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5" />
                  )}
                  {t("actions.proceed")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

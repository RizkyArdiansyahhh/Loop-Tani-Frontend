"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Sparkles,
  RefreshCw,
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
      toast.success("Pembayaran Berhasil! Pesanan Anda sedang diproses.");
      const timer = setTimeout(() => {
        onOpenChange(false);
        router.push(`/profile/orders/${orderId}`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPaid, orderId, onOpenChange, router]);

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
          toast.success(`Metode ${channel.name} dipilih`);
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
    toast.success(`${label} berhasil disalin!`);
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card border border-border/80 shadow-2xl rounded-2xl">
        {/* Top Header with Glassmorphism Effect */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-100 font-mono">
                Pembayaran Terenkripsi
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-white/10 text-white border-white/20 text-[10px] backdrop-blur-md"
            >
              Order #{orderNumber}
            </Badge>
          </div>

          <div className="mt-3">
            <span className="text-xs text-emerald-100/90 font-medium">
              Total Tagihan Pembayaran
            </span>
            <div className="text-2xl font-bold font-poppins text-white tracking-tight">
              {formattedAmount}
            </div>
          </div>
        </div>

        {/* Paid Success Overlay Animation */}
        {isPaid ? (
          <div className="p-8 text-center space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                Pembayaran Berhasil!
              </h3>
              <p className="text-xs text-muted-foreground">
                Terima kasih, pesanan Anda telah dikonfirmasi dan siap diproses oleh penjual.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-emerald-600 animate-pulse">
              Mengarahkan ke detail pesanan...
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Category Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-muted/60 rounded-xl border border-border/40">
              <button
                type="button"
                onClick={() => setSelectedCategory("VIRTUAL_ACCOUNT")}
                className={`flex flex-col items-center gap-1 py-2 px-1 text-[11px] font-medium rounded-lg transition-all ${
                  selectedCategory === "VIRTUAL_ACCOUNT"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Virtual Account
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("QRIS")}
                className={`flex flex-col items-center gap-1 py-2 px-1 text-[11px] font-medium rounded-lg transition-all ${
                  selectedCategory === "QRIS"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                QRIS
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("EWALLET")}
                className={`flex flex-col items-center gap-1 py-2 px-1 text-[11px] font-medium rounded-lg transition-all ${
                  selectedCategory === "EWALLET"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                E-Wallet
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("PAYLATER")}
                className={`flex flex-col items-center gap-1 py-2 px-1 text-[11px] font-medium rounded-lg transition-all ${
                  selectedCategory === "PAYLATER"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                PayLater
              </button>
            </div>

            {/* Channels Selector List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <span className="text-[11px] font-medium text-muted-foreground">
                Pilih Bank / Saluran Pembayaran:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredChannels.map((channel) => (
                  <button
                    key={channel.code}
                    type="button"
                    onClick={() => handleGeneratePayment(channel)}
                    disabled={createRequestMutation.isPending}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      selectedChannel.code === channel.code
                        ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                        : "border-border/60 hover:border-border bg-card"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {channel.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {channel.description}
                      </div>
                    </div>
                    {selectedChannel.code === channel.code && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Display Area (QR Code or Copyable VA) */}
            {paymentRequest && (
              <div className="bg-muted/40 p-4 rounded-xl border border-border/60 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* QRIS Render */}
                {selectedCategory === "QRIS" && (
                  <div className="text-center space-y-3">
                    <span className="text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Scan Kode QRIS Dibawah Ini
                    </span>
                    <div className="bg-white p-3 inline-block rounded-2xl shadow-sm border border-gray-200">
                      {mainAction?.qr_code ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            mainAction.qr_code,
                          )}`}
                          alt="QRIS Payment Code"
                          className="w-44 h-44 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-44 h-44 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded-lg">
                          Simulasi QRIS Sandbox
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Buka aplikasi GoPay, OVO, DANA, BCA Mobile, atau e-Wallet apapun lalu pindai kode QR.
                    </p>
                  </div>
                )}

                {/* Virtual Account / Direct Transfer Render */}
                {selectedCategory === "VIRTUAL_ACCOUNT" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Nomor Virtual Account {selectedChannel.name}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Batas 24 Jam
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl font-mono text-sm font-bold text-foreground">
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
                            "Nomor VA",
                          )
                        }
                        className="h-7 text-xs gap-1 text-emerald-600 hover:text-emerald-700"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {isCopied ? "Tersalin" : "Salin"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* E-Wallet / Redirect Render */}
                {(selectedCategory === "EWALLET" || selectedCategory === "PAYLATER") && (
                  <div className="text-center space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Klik tombol dibawah untuk melanjutkan pembayaran di aplikasi {selectedChannel.name}.
                    </p>
                    {mainAction?.url ? (
                      <Button
                        type="button"
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      >
                        <a
                          href={mainAction.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Buka {selectedChannel.name}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : (
                      <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
                        Sesi checkout {selectedChannel.name} siap. Silakan lakukan pembayaran.
                      </div>
                    )}
                  </div>
                )}

                {/* Polling Indicator */}
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground border-t border-border/40">
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                  <span>Mengecek status pembayaran otomatis...</span>
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
                className="text-xs"
              >
                Tutup & Bayar Nanti
              </Button>

              {!paymentRequest && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleGeneratePayment(selectedChannel)}
                  disabled={createRequestMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                >
                  {createRequestMutation.isPending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5" />
                  )}
                  Lanjutkan Pembayaran
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

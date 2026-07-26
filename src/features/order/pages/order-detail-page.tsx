"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useOrderDetail } from "../hooks/use-order-detail";
import { OrderTimeline } from "../components/order-timeline";
import { OrderAddressSnapshotCard } from "../components/order-address-snapshot";
import { OrderSummaryCard } from "../components/order-summary-card";
import { OrderStatusBadge } from "../components/order-status-badge";
import { PaymentModal } from "@/features/payment/components/payment-modal";
import { formatCurrency } from "@/shared/utils/currency.util";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Store } from "lucide-react";

interface OrderDetailPageProps {
  orderId: string;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const t = useTranslations("order.detail");
  const { data: order, isLoading, isError } = useOrderDetail(orderId);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <h2 className="text-base font-bold font-poppins text-foreground">
          Pesanan Tidak Ditemukan
        </h2>
        <p className="text-xs text-muted-foreground">
          Pesanan yang Anda cari tidak ada atau Anda tidak memiliki akses.
        </p>
        <Link
          href="/profile/orders"
          className="inline-block text-xs font-bold text-primary hover:underline"
        >
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-gray-950 font-sans pb-16 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/profile/orders"
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            ← {t("backToList")}
          </Link>

          <OrderStatusBadge status={order.orderStatus} />
        </div>

        {/* Title Bar */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/50 pb-3">
          <div>
            <h1 className="text-lg font-bold font-poppins text-foreground">
              {t("title")}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              No. Order: {order.orderNumber}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>

        {/* Status Timeline Progress Bar */}
        <OrderTimeline status={order.orderStatus} />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Left Column: Address Snapshot & Product Snapshot List */}
          <div className="lg:col-span-2 space-y-4">
            <OrderAddressSnapshotCard address={order.shippingAddress} />

            {/* Store & Products Snapshot Card */}
            <Card className="border border-border/60 rounded-2xl overflow-hidden bg-card shadow-xs">
              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Store Header */}
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <Store className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-bold text-foreground font-poppins">
                    {order.seller.storeName}
                  </span>
                </div>

                {/* Items Snapshot List */}
                <div className="divide-y divide-border/30">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3.5 items-start py-3 first:pt-0 last:pb-0">
                      <div className="relative h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/60">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-semibold text-foreground line-clamp-2 font-poppins">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{item.quantity} barang</span>
                          <span>•</span>
                          <span>{(item.weight * item.quantity / 1000).toFixed(1)} kg</span>
                        </div>
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatCurrency(item.productPrice)}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

            <OrderSummaryCard
              pricing={order.pricing}
              status={order.orderStatus}
              expiredAt={order.expiredAt}
              onPayClick={() => setIsPaymentModalOpen(true)}
            />

        </div>
      </div>

      {/* Interactive Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          orderId={order.id}
          paymentId={order.id}
          amount={order.pricing.grandTotal}
          orderNumber={order.orderNumber}
        />
      )}
    </div>
  );
}

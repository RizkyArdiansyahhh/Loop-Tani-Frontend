"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { useSellerOrders } from "../hooks/use-seller-orders";
import { useUpdateOrderStatus } from "../hooks/use-update-order-status";
import type { SellerOrder } from "../api/get-seller-orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  MapPin,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";

export function SellerOrdersPage() {
  const t = useTranslations("seller.orders");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  // TanStack Query hook - fetched dynamically from backend API
  const { data: response, isLoading, isFetching, refetch } = useSellerOrders({
    page,
    limit: 10,
    status: activeTab === "ALL" ? undefined : activeTab,
    search: searchQuery || undefined,
  });

  const updateStatusMutation = useUpdateOrderStatus();

  const orders = response?.data || [];
  const meta = response?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleUpdateStatus = (orderId: string, nextStatus: string, actionLabel: string) => {
    updateStatusMutation.mutate(
      { orderId, payload: { status: nextStatus } },
      {
        onSuccess: () => {
          toast.success(t("toastSuccess", { status: actionLabel }));
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(null);
          }
        },
        onError: () => {
          toast.error(t("toastError"));
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-poppins text-[10px] font-bold">
            <Clock className="w-3 h-3 mr-1" /> {t("status.pendingPayment")}
          </Badge>
        );
      case "PAID":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-poppins text-[10px] font-bold">
            <Receipt className="w-3 h-3 mr-1" /> {t("status.paid")}
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-poppins text-[10px] font-bold">
            <Package className="w-3 h-3 mr-1" /> {t("status.processing")}
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 font-poppins text-[10px] font-bold">
            <Truck className="w-3 h-3 mr-1" /> {t("status.shipped")}
          </Badge>
        );
      case "DELIVERED":
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-poppins text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 mr-1" /> {t("status.completed")}
          </Badge>
        );
      case "CANCELLED":
      case "EXPIRED":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-poppins text-[10px] font-bold">
            <XCircle className="w-3 h-3 mr-1" /> {t("status.cancelled")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border/60 font-poppins text-[10px] font-bold">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

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

      {/* ── TAB FILTER STATUS & SEARCH BAR ── */}
      <div className="bg-card border border-border/70 p-4 rounded-2xl space-y-3.5 shadow-xs font-poppins">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: t("tabs.all") },
            { id: "PAID", label: t("tabs.paid") },
            { id: "PROCESSING", label: t("tabs.processing") },
            { id: "SHIPPED", label: t("tabs.shipped") },
            { id: "COMPLETED", label: t("tabs.completed") },
            { id: "CANCELLED", label: t("tabs.cancelled") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10 text-xs h-10 rounded-xl border-border/60 font-sans"
          />
        </div>
      </div>

      {/* ── DAFTAR PESANAN ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-muted/40 animate-pulse border border-border/60" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-2xl p-12 text-center space-y-3 font-poppins">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">{t("emptyTitle")}</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery || activeTab !== "ALL"
              ? t("emptyDescSearch")
              : t("emptyDescAll")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border/70 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs hover:border-primary/40 transition-all font-sans"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3 font-poppins">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-foreground font-mono">#{order.orderNumber}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-[11px]">{formatDate(order.createdAt)}</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{order.buyerName}</span>
                  </div>
                </div>
                <div>{getStatusBadge(order.orderStatus)}</div>
              </div>

              {/* Order Items List */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted/40 border border-border/60 shrink-0 flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5 font-poppins">
                      <p className="text-xs font-bold text-foreground truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-poppins">
                      <span className="text-xs font-bold text-foreground font-mono">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/40 pt-3.5 font-poppins">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t("modal.grandTotal")}</span>
                  <span className="text-sm font-bold text-primary font-mono">
                    {formatCurrency(order.grandTotal)}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="h-9 px-3.5 rounded-xl text-xs font-bold border-border/60 cursor-pointer"
                  >
                    {t("actions.details")}
                  </Button>

                  {/* Contextual Action Buttons */}
                  {order.orderStatus === "PAID" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, "PROCESSING", t("status.processing"))}
                      disabled={updateStatusMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Package className="w-3.5 h-3.5" />
                      {t("actions.process")}
                    </Button>
                  )}

                  {order.orderStatus === "PROCESSING" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, "SHIPPED", t("status.shipped"))}
                      disabled={updateStatusMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      {t("actions.ship")}
                    </Button>
                  )}

                  {order.orderStatus === "SHIPPED" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, "COMPLETED", t("status.completed"))}
                      disabled={updateStatusMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t("actions.complete")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PAGINATION CONTROLS ── */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 font-poppins text-xs">
          <span className="text-muted-foreground">
            {t("pagination", { page: meta.page, totalPages: meta.totalPages, total: meta.total })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-3 rounded-lg text-xs font-bold border-border/60 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="h-8 px-3 rounded-lg text-xs font-bold border-border/60 cursor-pointer"
            >
              {t("next")} <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── DETAIL PESANAN MODAL ── */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="max-w-xl rounded-2xl p-6 font-sans border-border/80">
            <DialogHeader className="border-b border-border/40 pb-3">
              <DialogTitle className="text-base font-bold font-poppins flex items-center justify-between gap-2">
                <span>{t("modal.title", { orderNumber: selectedOrder.orderNumber })}</span>
                {getStatusBadge(selectedOrder.orderStatus)}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("modal.time", { date: formatDate(selectedOrder.createdAt) })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Shipping Address */}
              <div className="bg-muted/30 border border-border/60 p-3.5 rounded-xl space-y-1.5 font-poppins">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{t("modal.addressTitle")}</span>
                </div>
                <p className="font-bold text-foreground">{selectedOrder.buyerName}</p>
                {selectedOrder.buyerPhone && (
                  <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-muted-foreground" /> {selectedOrder.buyerPhone}
                  </p>
                )}
                <p className="text-muted-foreground leading-relaxed text-[11px] pt-1">
                  {selectedOrder.shippingAddress}
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 font-poppins">
                <h4 className="font-bold text-xs text-foreground">{t("modal.itemsTitle", { count: selectedOrder.items.length })}</h4>
                <div className="space-y-2 border border-border/60 rounded-xl p-3 bg-card">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-foreground truncate">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.quantity} {item.unit || "unit"} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="font-bold font-mono text-foreground">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border border-border/60 rounded-xl p-3.5 space-y-2 bg-card font-poppins">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("modal.subtotal")}</span>
                  <span className="font-mono text-foreground">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("modal.shippingCost")}</span>
                  <span className="font-mono text-foreground">{formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                {selectedOrder.serviceFee > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("modal.serviceFee")}</span>
                    <span className="font-mono text-foreground">{formatCurrency(selectedOrder.serviceFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/40 pt-2">
                  <span>{t("modal.grandTotal")}</span>
                  <span className="text-primary font-mono">{formatCurrency(selectedOrder.grandTotal)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border/40 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedOrder(null)}
                className="h-10 px-5 rounded-xl text-xs font-bold cursor-pointer border-border/60 font-poppins"
              >
                {t("modal.close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

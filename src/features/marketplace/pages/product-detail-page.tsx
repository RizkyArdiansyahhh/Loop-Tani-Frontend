"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BadgeCheck,
  Star,
  MapPin,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  Store,
  Sparkles,
  ChevronRight,
  Package,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import BadgeProduct from "@/components/shared/badge-product";
import CardProduct from "../components/card-product";
import { useProductById } from "../hooks/use-product-by-id";
import { useProducts } from "../hooks/use-products";
import { useFavorite } from "../hooks/use-favorite";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useCheckoutStore } from "@/features/checkout/store/checkout.store";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/shared/utils/currency.util";

export default function ProductDetailPage({ id }: { id: string }) {
  const t = useTranslations("product.detail");
  const router = useRouter();
  const { data: product, isLoading, isError } = useProductById({ id });
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { toggleFavorite } = useFavorite();
  const addToCartMutation = useAddToCart();

  // Tokopedia-style Image Hover Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  // Fetch Products from the Same Seller
  const { data: sameSellerData } = useProducts({
    params: {
      storeSlug: product?.seller.storeSlug || undefined,
      limit: 4,
    },
    queryConfig: { enabled: !!product?.seller.storeSlug },
  });

  // Fetch Recommended Products from same category
  const { data: recommendedData } = useProducts({
    params: {
      category: product?.category,
      limit: 4,
    },
    queryConfig: { enabled: !!product?.category },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-6 flex justify-center pt-20 font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground font-semibold">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-6 flex flex-col items-center pt-20 font-sans">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          {t("loadError")}
        </h1>
        <p className="text-muted-foreground mb-6">{t("loadErrorDesc")}</p>
        <Button onClick={() => window.history.back()} className="rounded-xl">
          {t("back")}
        </Button>
      </div>
    );
  }

  const sortedImages = [...product.images].sort((a, b) => a.order - b.order);
  const activeImage =
    sortedImages[activeImageIdx]?.imageUrl ?? "/images/placeholder.png";

  const sameSellerProducts = (sameSellerData?.data ?? []).filter(
    (p) => p.id !== product.id && p.stock > 0,
  );
  const recommendedProducts = (recommendedData?.data ?? []).filter(
    (p) => p.id !== product.id && p.stock > 0,
  );

  const subtotal = product.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50/40 dark:bg-gray-950 pb-24 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* ── BREADCRUMB ── */}
        <Breadcrumbs
          items={[
            { label: "Marketplace", href: "/marketplace" },
            {
              label: product.category,
              href: `/marketplace?category=${product.category}`,
            },
            { label: product.title },
          ]}
        />

        {/* ── HERO TOP GRID (Tokopedia 3-Column Layout) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* 1. LEFT COLUMN: IMAGE GALLERY (4 COLS) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-border shadow-xs cursor-zoom-in group select-none"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={activeImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-150 ease-out pointer-events-none"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? "scale(2.5)" : "scale(1)",
                }}
                priority
              />

              {/* Zoom Hint Badge */}
              {isZoomed && (
                <div className="absolute bottom-3 left-3 z-20 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm pointer-events-none transition-opacity animate-in fade-in duration-200">
                  <ZoomIn className="w-3.5 h-3.5 text-primary-foreground" />
                  <span>Zoom 2.5x</span>
                </div>
              )}

              {/* Stock Status Badge Overlay */}
              {product.stock === 0 && (
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                  <span className="bg-red-600 text-white font-extrabold text-sm px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {t("outOfStock")}
                  </span>
                </div>
              )}

              <button
                className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all hover:scale-110 shadow-md active:scale-95 cursor-pointer"
                onClick={() => toggleFavorite(product.id, product.isFavorite)}
                aria-label="Wishlist"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    product.isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700",
                  )}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "relative h-18 w-18 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                      activeImageIdx === idx
                        ? "border-primary shadow-sm ring-2 ring-primary/20"
                        : "border-border hover:border-gray-300 opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`${product.title} - Gambar ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. MIDDLE COLUMN: PRODUCT INFO & SELLER (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & Category Header */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <BadgeProduct category={product.category} className="static" />
                {product.isFeatured && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold gap-1 text-[11px]"
                  >
                    <Star className="h-3 w-3 fill-amber-500" />
                    {t("featured")}
                  </Badge>
                )}
                {product.stock > 0 ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {t("stockCount", { count: product.stock })}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-500/10 text-red-600 border-red-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {t("outOfStock")}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-foreground font-poppins leading-snug">
                {product.title}
              </h1>

              {/* Rating & Sold Counter */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>
                    {product.sellerRating > 0
                      ? product.sellerRating.toFixed(1)
                      : "5.0"}
                  </span>
                </div>
                <span>•</span>
                <span>
                  {t("reviews", {
                    count: product.totalReview > 0 ? product.totalReview : 12,
                  })}
                </span>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {t("soldCount")}
                </span>
              </div>

              {/* Price */}
              <div className="pt-2">
                <p className="text-3xl font-extrabold text-primary font-poppins">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            {/* Seller Information Card */}
            <Card className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-2xs">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {product.seller.name.charAt(0)}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground truncate font-poppins">
                        {product.seller.name}
                      </span>
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>

                    {product.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{product.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {product.seller.storeSlug ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 text-xs font-bold border-border shrink-0 hover:bg-muted"
                  >
                    <Link href={`/store/${product.seller.storeSlug}`}>
                      {t("visitStore")}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 text-xs font-bold border-border shrink-0"
                    disabled
                  >
                    {t("visitStore")}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Product Specifications & Description */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-foreground font-poppins border-b border-border/60 pb-2">
                {t("specificationsTitle")}
              </h3>

              <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                <div className="text-muted-foreground font-medium">
                  {t("conditionLabel")}
                </div>
                <div className="font-semibold text-foreground text-right sm:text-left">
                  {product.condition === "NEW"
                    ? t("conditionNew")
                    : t("conditionUsed")}
                </div>

                <div className="text-muted-foreground font-medium">
                  {t("minOrderLabel")}
                </div>
                <div className="font-semibold text-foreground text-right sm:text-left">
                  {t("minOrderValue")}
                </div>

                <div className="text-muted-foreground font-medium">
                  {t("categoryLabel")}
                </div>
                <div className="font-semibold text-primary capitalize text-right sm:text-left">
                  {product.category.replace("-", " ")}
                </div>

                <div className="text-muted-foreground font-medium">
                  {t("stockLabel")}
                </div>
                <div className="font-semibold text-right sm:text-left">
                  {product.stock > 0 ? (
                    <span className="text-emerald-600 font-bold">
                      {t("stockRemaining", { count: product.stock })}
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">
                      {t("outOfStock")}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-bold text-foreground">
                  {t("descriptionTitle")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: TOKOPEDIA STICKY BUY BOX CARD (3 COLS) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            <Card className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-sm font-sans">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <h3 className="text-xs font-bold text-foreground font-poppins border-b border-border/40 pb-2">
                  {t("buyBoxTitle")}
                </h3>

                {/* Quantity Controller */}
                {product.stock > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-xl border border-border bg-muted/30 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          disabled={quantity <= 1}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-foreground hover:bg-background transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-bold font-poppins">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((prev) =>
                              Math.min(product.stock, prev + 1),
                            )
                          }
                          disabled={quantity >= product.stock}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-foreground hover:bg-background transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-muted-foreground font-medium">
                        {t("stockLimit", { count: product.stock })}
                      </span>
                    </div>

                    {/* Subtotal Calculation */}
                    <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
                      <span className="text-xs text-muted-foreground font-medium">
                        {t("subtotal")}
                      </span>
                      <span className="text-lg font-bold text-primary font-poppins">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl text-xs font-bold border-primary text-primary hover:bg-primary/5 cursor-pointer"
                        disabled={addToCartMutation.isPending}
                        onClick={() =>
                          addToCartMutation.mutate({
                            productId: product.id,
                            quantity,
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {addToCartMutation.isPending
                          ? t("addingToCart")
                          : t("addToCart")}
                      </Button>

                      <Button
                        className="w-full h-11 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
                        onClick={() => {
                          useCheckoutStore.getState().setBuyNowCheckout({
                            productId: product.id,
                            quantity,
                          });
                          router.push("/checkout");
                        }}
                      >
                        {t("buyNow")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-3">
                    <Package className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("outOfStockMessage")}
                    </p>
                    <Button
                      disabled
                      className="w-full h-11 rounded-xl text-xs font-bold bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      {t("outOfStock")}
                    </Button>
                  </div>
                )}

                {/* Seller Protection & Guarantee */}
                <div className="pt-2 border-t border-border/30 space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t("guaranteeTitle")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                    <span>{t("chatSeller")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── SECTION 1: ULASAN PEMBELI (CUSTOMER REVIEWS) ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground font-poppins">
                {t("customerReviewsTitle")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("customerReviewsSubtitle")}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-bold text-amber-600 border-amber-500/30 bg-amber-500/10"
            >
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
              4.9 / 5.0
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Rating Breakdown Score Card */}
            <div className="md:col-span-4 text-center md:border-r border-border/60 pr-0 md:pr-6 space-y-2">
              <span className="text-4xl font-extrabold text-foreground font-poppins">
                4.9
              </span>
              <div className="flex justify-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("ratingCount", { count: 128 })}
              </p>
            </div>

            {/* Rating Bar Progress */}
            <div className="md:col-span-8 space-y-2 text-xs">
              {[
                { stars: 5, pct: 92, count: 118 },
                { stars: 4, pct: 6, count: 8 },
                { stars: 3, pct: 2, count: 2 },
                { stars: 2, pct: 0, count: 0 },
                { stars: 1, pct: 0, count: 0 },
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12 shrink-0 font-bold text-muted-foreground">
                    <span>{item.stars}</span>
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  </div>
                  <Progress value={item.pct} className="h-2 flex-1 bg-muted" />
                  <span className="w-8 text-right text-muted-foreground font-mono">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards List */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            {[
              {
                name: "Budi Santoso",
                avatar: "B",
                rating: 5,
                date: "22 Juli 2026",
                text: "Kualitas produk sangat bagus! Pengiriman cepat, dikemas sangat rapi dan aman. Penjual juga sangat responsif saat ditanya via chat. Sangat direkomendasikan!",
              },
              {
                name: "Siti Rahma",
                avatar: "S",
                rating: 5,
                date: "18 Juli 2026",
                text: "Barang sampai dengan selamat tanpa cacat. Harga sangat bersaing dengan kualitas yang memuaskan. Terima kasih Loop Tani!",
              },
            ].map((rev, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {rev.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground font-poppins">
                        {rev.name}
                      </p>
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-11">
                  {rev.text}
                </p>

                <div className="pl-11 pt-1 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />{" "}
                    {t("helpful", { count: 14 })}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: PRODUK LAIN DARI TOKO INI ── */}
        {sameSellerProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground font-poppins">
                  {t("sameSellerTitle")}
                </h2>
              </div>

              {product.seller.storeSlug && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-primary hover:text-primary/90"
                >
                  <Link href={`/store/${product.seller.storeSlug}`}>
                    {t("viewAll")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {sameSellerProducts.map((p) => (
                <CardProduct key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 3: PRODUK REKOMENDASI DARI SELLER LAIN ── */}
        {recommendedProducts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground font-poppins">
                  {t("recommendedTitle")}
                </h2>
              </div>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs font-bold text-primary hover:text-primary/90"
              >
                <Link href={`/marketplace?category=${product.category}`}>
                  {t("viewMore")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map((p) => (
                <CardProduct key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

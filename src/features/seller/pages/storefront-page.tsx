"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Store,
  MapPin,
  Calendar,
  Phone,
  Search,
  Star,
  Sparkles,
  Inbox,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStore } from "../hooks/use-store";
import { useProducts } from "@/features/marketplace/hooks/use-products";
import CardProduct from "@/features/marketplace/components/card-product";
import Breadcrumbs from "@/components/shared/breadcrumbs";

interface StorefrontPageProps {
  slug: string;
}

export default function StorefrontPage({ slug }: StorefrontPageProps) {
  const t = useTranslations("seller");
  const router = useRouter();

  // Tabs state: "home" | "products" | "about"
  const [activeTab, setActiveTab] = useState<"home" | "products" | "about">("home");

  // Products Tab states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recommended");
  const [page, setPage] = useState(1);

  // Fetch public store data
  const { data: store, isLoading: isStoreLoading, isError: isStoreError } = useStore(slug);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch store products for Products Tab
  const productsParams = {
    storeSlug: slug,
    page,
    limit: 6,
    search: debouncedSearch || undefined,
    category: selectedCategory === "all" ? undefined : (selectedCategory as any),
    sort: selectedSort as any,
  };

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    params: productsParams,
    queryConfig: { enabled: !!store && activeTab === "products" },
  });

  // Fetch latest products for Home Tab
  const { data: latestProductsData, isLoading: isLatestLoading } = useProducts({
    params: {
      storeSlug: slug,
      page: 1,
      limit: 3,
      sort: "newest" as any,
    },
    queryConfig: { enabled: !!store && activeTab === "home" },
  });

  const storeProducts = productsData?.data ?? [];
  const totalPages = productsData?.meta.totalPages ?? 1;
  const latestProducts = latestProductsData?.data ?? [];

  if (isStoreLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 pb-24 dark:bg-gray-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          <Skeleton className="h-6 w-48 rounded-lg" />
          
          {/* Header Skeleton */}
          <div className="bg-white border border-gray-150 rounded-xl p-6 dark:bg-gray-900 dark:border-gray-800 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded-lg" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-12 w-28 rounded-lg" />
            <Skeleton className="h-12 w-28 rounded-lg" />
            <Skeleton className="h-12 w-28 rounded-lg" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-150 rounded-xl p-4 dark:bg-gray-900 dark:border-gray-800 space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-6 w-1/4 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isStoreError || !store) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex flex-col items-center justify-center p-6 dark:bg-gray-950">
        <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded-xl p-8 dark:bg-gray-900 dark:border-gray-800 shadow-xl space-y-6">
          <div className="h-16 w-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="font-fraunces text-2xl font-bold text-gray-900 dark:text-white">
            {t("storefront.notFound")}
          </h2>
          <p className="text-sm text-muted-foreground">
            Toko yang Anda cari mungkin telah dinonaktifkan sementara atau URL slug tidak sesuai.
          </p>
          <Button asChild className="w-full rounded-xl py-6 font-bold cursor-pointer">
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t("storefront.backToMarketplace")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format date helper
  const formattedJoinedDate = () => {
    try {
      const date = new Date(store.createdAt);
      return date.toLocaleDateString("id-ID", { year: "numeric", month: "long" });
    } catch {
      return store.createdAt;
    }
  };

  const hasReviews = store.stats.totalReview > 0 && store.stats.averageRating !== null;

  const getWhatsAppLink = (phone: string | null) => {
    if (!phone) return "#";
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-24 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Marketplace", href: "/marketplace" },
            { label: store.storeName },
          ]}
        />

        {/* ── STORE HEADER BANNER ── */}
        <Card className="overflow-hidden border border-gray-150 rounded-xl dark:border-gray-800 dark:bg-gray-900 shadow-2xs">
          {/* Banner cover background */}
          <div className="h-32 sm:h-44 bg-linear-to-r from-emerald-800 via-primary to-emerald-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(253,224,71,0.1),transparent)]" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          </div>

          <CardContent className="relative p-6 pt-0">
            {/* Store logo positioning */}
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 sm:-mt-16 gap-6">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-end text-center sm:text-left">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white dark:border-gray-900 bg-white overflow-hidden shadow-md shrink-0">
                  <Image
                    src={store.logoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"}
                    alt={store.storeName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-2 pt-1 pb-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="font-fraunces text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {store.storeName}
                    </h1>
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold border-0 flex items-center gap-1 text-[10px] py-1 px-2.5 rounded-full shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5 fill-emerald-100 dark:fill-emerald-900/50" />
                      {t("storefront.verified")}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {store.city || "Lokasi"}, {store.province || ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {t("storefront.joined", { date: formattedJoinedDate() })}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact Button */}
              {store.phone && (
                <div className="flex w-full sm:w-auto shrink-0 pb-1">
                  <Button
                    asChild
                    className="w-full sm:w-auto rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs px-6 text-white shadow-xs cursor-pointer"
                  >
                    <a
                      href={getWhatsAppLink(store.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4.5 w-4.5" />
                      Hubungi via WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-6 border-gray-100 dark:border-gray-800/80" />

            {/* Aggregated Stats Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-3xs font-bold text-muted-foreground uppercase tracking-widest block">Rating Toko</span>
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">
                    {hasReviews ? store.stats.averageRating : "-"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({store.stats.totalReview} {t("storefront.reviews")})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-3xs font-bold text-muted-foreground uppercase tracking-widest block">Semua Produk</span>
                <span className="text-base font-extrabold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-1">
                  <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                  {store.stats.totalProducts}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-3xs font-bold text-muted-foreground uppercase tracking-widest block">Status Toko</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 font-bold text-[10px] rounded-md px-2 py-0.5 mt-0.5 w-max mx-auto md:mx-0">
                  Toko Aktif
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── STORE NAVIGATION TABS ── */}
        <div className="flex p-1 rounded-xl bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 w-full md:w-auto shadow-3xs">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === "home"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-850 dark:text-white"
                : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Store className="h-4 w-4" />
            {t("storefront.homeTab")}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === "products"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-850 dark:text-white"
                : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {t("storefront.productsTab")} ({store.stats.totalProducts})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === "about"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-850 dark:text-white"
                : "text-muted-foreground hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            {t("storefront.aboutTab")}
          </button>
        </div>

        {/* ── TAB CONTENT ── */}

        {/* 1. HOME TAB */}
        {activeTab === "home" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Left sidebar info */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-xl border border-gray-100 p-6 dark:border-gray-850 dark:bg-gray-900/50">
                <CardContent className="p-0 space-y-4">
                  <h3 className="font-fraunces text-lg font-bold text-gray-900 dark:text-white">
                    Deskripsi Toko
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {store.description || "Belum ada deskripsi untuk toko ini."}
                  </p>
                </CardContent>
              </Card>

              {/* Circular Achievement highlight */}
              <Card className="rounded-xl border border-emerald-100/50 p-6 bg-emerald-50/10 dark:border-emerald-950/20 dark:bg-emerald-950/5">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Sparkles className="h-5 w-5 fill-current" />
                    Circular Badge
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Penjual ini mendukung gerakan pengolahan kembali limbah pertanian menjadi pupuk ramah lingkungan.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right main panel - Latest Products */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 fill-current" />
                {t("storefront.latestProducts")}
              </h3>
              
              {isLatestLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-150 rounded-xl p-4 dark:bg-gray-900 dark:border-gray-800 space-y-4 animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg dark:bg-gray-800" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded-lg dark:bg-gray-800" />
                    </div>
                  ))}
                </div>
              ) : latestProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latestProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-800">
                  <Inbox className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t("storefront.noProducts")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-6 pt-2">
            
            {/* Search, Category Filters, Sort Bar */}
            <div className="bg-white border border-gray-100 p-5 rounded-xl dark:bg-gray-900 dark:border-gray-800 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-455 h-4.5 w-4.5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("storefront.searchPlaceholder")}
                    className="w-full pl-10.5 rounded-xl border-gray-200"
                  />
                </div>
                
                {/* Sorting */}
                <div className="flex gap-2">
                  <Select value={selectedSort} onValueChange={(val) => { setSelectedSort(val); setPage(1); }}>
                    <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-gray-200 text-xs font-semibold">
                      <SelectValue placeholder={t("storefront.sortBy")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="recommended">Terpopuler</SelectItem>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="price-asc">Harga Terendah</SelectItem>
                      <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-xs font-bold text-gray-500 mr-2">Kategori:</span>
                {[
                  { value: "all", label: "Semua" },
                  { value: "agricultural-waste", label: "Limbah Pertanian" },
                  { value: "processed-product", label: "Produk Olahan" },
                  { value: "secondhand", label: "Alat Secondhand" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { setSelectedCategory(cat.value); setPage(1); }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      selectedCategory === cat.value
                        ? "bg-primary text-white border-primary font-bold shadow-xs"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Feed Grid */}
            {isProductsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-gray-150 rounded-xl p-4 dark:bg-gray-900 dark:border-gray-800 space-y-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg dark:bg-gray-800" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded-lg dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : storeProducts.length > 0 ? (
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {storeProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800">
                    <span className="text-xs text-muted-foreground font-semibold">
                      Halaman {page} dari {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="rounded-lg px-4 py-5 h-auto cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Sebelumnya
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="rounded-lg px-4 py-5 h-auto cursor-pointer"
                      >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-800 bg-gray-50/10">
                <Inbox className="h-10 w-10 text-muted-foreground/65 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada produk ditemukan.</p>
              </div>
            )}
          </div>
        )}

        {/* 3. ABOUT TAB */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            {/* Store Information Detail (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-xl border border-gray-100 p-6 sm:p-8 dark:border-gray-850 dark:bg-gray-900/50 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-fraunces text-xl font-bold text-gray-900 dark:text-white">
                    {t("storefront.aboutTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {store.description || "Belum ada deskripsi untuk toko ini."}
                  </p>
                </div>

                <Separator className="border-gray-100 dark:border-gray-850" />

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Detail Kontak & Lokasi
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-gray-900 dark:text-white">Alamat Toko</span>
                        <span>
                          {store.address || ""}, {store.city || ""}, {store.province || ""} {store.postalCode || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-gray-900 dark:text-white">WhatsApp/Telepon</span>
                        <span>{store.phone || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* LoopTani Circular Agriculture Differentiator Widget */}
              <Card className="rounded-xl border border-emerald-100 bg-emerald-50/15 p-6 sm:p-8 dark:border-emerald-950/20 dark:bg-emerald-950/5 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-2xl" />
                <CardContent className="p-0 space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold">
                        <Sparkles className="h-5 w-5 fill-current text-emerald-600" />
                        {t("storefront.circularImpact")}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                        {t("storefront.circularImpactDesc")}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold border-0 rounded-full px-3 py-1 text-3xs shrink-0">
                      {t("storefront.comingSoon")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="border border-emerald-100/50 bg-white/60 dark:bg-gray-900/40 dark:border-emerald-950/30 p-4 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Limbah Diolah</span>
                      <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">0 Kg</span>
                    </div>

                    <div className="border border-emerald-100/50 bg-white/60 dark:bg-gray-900/40 dark:border-emerald-950/30 p-4 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Produk Organik</span>
                      <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">0 Unit</span>
                    </div>

                    <div className="border border-emerald-100/50 bg-white/60 dark:bg-gray-900/40 dark:border-emerald-950/30 p-4 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Petani Terbantu</span>
                      <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">0 Mitra</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gamification / Badges section (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-xl border border-gray-100 p-6 dark:border-gray-850 dark:bg-gray-900/50 space-y-4">
                <h3 className="font-fraunces text-base font-bold text-gray-900 dark:text-white">
                  Lencana Mitra Tani
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-50 bg-gray-50/20 dark:border-gray-855 dark:bg-gray-900">
                    <span className="h-10 w-10 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 text-sm font-black dark:bg-amber-950/30 dark:text-amber-400 select-none">🌱</span>
                    <div>
                      <span className="text-xs font-bold text-gray-950 dark:text-white block">Eco Partner</span>
                      <span className="text-[10px] text-muted-foreground">Mendukung praktek hijau ramah lingkungan.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-50 bg-gray-50/20 dark:border-gray-855 dark:bg-gray-900">
                    <span className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 text-sm font-black dark:bg-emerald-950/30 dark:text-emerald-400 select-none">♻️</span>
                    <div>
                      <span className="text-xs font-bold text-gray-950 dark:text-white block">Circular Seller</span>
                      <span className="text-[10px] text-muted-foreground">Mendaur ulang limbah tani menjadi produk baru.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-50 bg-gray-50/20 dark:border-gray-855 dark:bg-gray-900">
                    <span className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-sm font-black dark:bg-blue-950/30 dark:text-blue-400 select-none">🏆</span>
                    <div>
                      <span className="text-xs font-bold text-gray-950 dark:text-white block">Trusted Seller</span>
                      <span className="text-[10px] text-muted-foreground">Memiliki rating pelayanan pembeli terbaik.</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

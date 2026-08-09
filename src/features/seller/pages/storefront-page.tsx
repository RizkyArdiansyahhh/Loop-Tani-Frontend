"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Calendar,
  Phone,
  Search,
  Star,
  Inbox,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
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

  // Tabs state: "home" | "products" | "about" | "impact"
  const [activeTab, setActiveTab] = useState<"home" | "products" | "about" | "impact">("home");

  // Products Tab filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("recommended");
  const [selectedStockFilter, setSelectedStockFilter] = useState<"all" | "in_stock" | "out_of_stock">("all");
  const [page, setPage] = useState(1);

  // Fetch public store data via TanStack Query
  const { data: store, isLoading: isStoreLoading, isError: isStoreError } = useStore(slug);

  // Fetch store products for Products Tab
  const productsParams = {
    storeSlug: slug,
    page,
    limit: 6,
    search: searchQuery || undefined,
    category: selectedCategory === "all" ? undefined : (selectedCategory as any),
    sort: selectedSort as any,
    includeOutOfStock: true,
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
      limit: 6,
      sort: "newest" as any,
    },
    queryConfig: { enabled: !!store && activeTab === "home" },
  });

  const rawStoreProducts = productsData?.data ?? [];
  const storeProducts = rawStoreProducts.filter((p) => {
    if (selectedStockFilter === "in_stock") return p.stock > 0;
    if (selectedStockFilter === "out_of_stock") return p.stock === 0;
    return true;
  });
  const totalPages = productsData?.meta.totalPages ?? 1;
  const latestProducts = latestProductsData?.data ?? [];

  if (isStoreLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 transition-colors font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isStoreError || !store) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-xs space-y-6">
          <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="font-poppins text-2xl font-bold text-foreground">
            {t("storefront.notFound")}
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Toko yang Anda cari mungkin tidak aktif atau URL slug tidak sesuai.
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
    <div className="min-h-screen bg-background pb-20 transition-colors font-sans select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Marketplace", href: "/marketplace" },
            { label: store.storeName },
          ]}
        />

        {/* ── TOKOPEDIA STYLE STORE HEADER BANNER ── */}
        <Card className="overflow-hidden border border-border/70 rounded-2xl bg-card shadow-xs">
          {/* Subtle Banner Header */}
          <div
            className="h-28 sm:h-36 bg-linear-to-r from-primary/80 via-primary to-primary/95 relative overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: store.bannerUrl
                ? `linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url("${store.bannerUrl}")`
                : undefined,
            }}
          />

          <CardContent className="relative p-6 pt-0 font-sans">
            {/* Store Logo & Essential Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 sm:-mt-14 gap-6">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-end text-center sm:text-left">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-background bg-card overflow-hidden shadow-md shrink-0">
                  <Image
                    src={store.logoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"}
                    alt={store.storeName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-1.5 pt-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="font-poppins text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                      {store.storeName}
                    </h1>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold border-0 flex items-center gap-1 text-[11px] py-0.5 px-2.5 rounded-full shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {t("storefront.verified")}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {store.city || "Lokasi"}, {store.province || ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {t("storefront.joined", { date: formattedJoinedDate() })}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact Action */}
              {store.phone && (
                <div className="flex w-full sm:w-auto shrink-0 pb-1">
                  <Button
                    asChild
                    size="sm"
                    className="w-full sm:w-auto rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 shadow-xs cursor-pointer"
                  >
                    <a
                      href={getWhatsAppLink(store.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Hubungi Penjual
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-5 border-border/50" />

            {/* Clean Key Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center md:text-left max-w-xl font-sans">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-muted-foreground block">Rating Toko</span>
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-foreground">
                    {hasReviews ? store.stats.averageRating : "-"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ({store.stats.totalReview})
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-muted-foreground block">Semua Produk</span>
                <span className="text-sm font-bold text-foreground block">
                  {store.stats.totalProducts} Produk
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-muted-foreground block">Status Toko</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold text-[10px] rounded-md px-2 py-0.5">
                  Toko Aktif
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── TOKOPEDIA STYLE TAB NAVIGATION ── */}
        <div className="flex border-b border-border/70 gap-2 sm:gap-6 font-poppins text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("home")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 -mb-px ${
              activeTab === "home"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("storefront.homeTab")}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 -mb-px ${
              activeTab === "products"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("storefront.productsTab")} ({store.stats.totalProducts})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 -mb-px ${
              activeTab === "about"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("storefront.aboutTab")}
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === "impact"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{t("storefront.impactTab")}</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-extrabold px-1.5 py-0">
              {t("storefront.comingSoon")}
            </Badge>
          </button>
        </div>

        {/* ── TAB CONTENTS ── */}

        {/* 1. HOME TAB */}
        {activeTab === "home" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 font-sans">
            {/* Left Sidebar Description Card */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
                <h3 className="font-poppins text-sm font-bold text-foreground">
                  Deskripsi Toko
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {store.description || "Belum ada deskripsi untuk toko ini."}
                </p>
              </Card>

              {/* Clean Circular Agriculture Highlight Badge */}
              <Card className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-2">
                <span className="text-xs font-bold text-primary block font-poppins">
                  Mitra Pertanian Sirkular
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Penjual ini mendukung gerakan pengolahan kembali limbah pertanian menjadi pupuk ramah lingkungan.
                </p>
              </Card>
            </div>

            {/* Right Feed - Latest Products */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-poppins text-base font-bold text-foreground">
                {t("storefront.latestProducts")}
              </h3>
              
              {isLatestLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 animate-pulse">
                      <div className="aspect-square bg-muted rounded-xl" />
                      <div className="h-4 w-3/4 bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : latestProducts.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {latestProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 py-12 text-center bg-card">
                  <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">{t("storefront.noProducts")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-6 pt-2 font-sans">
            {/* Filter Bar */}
            <Card className="p-4 rounded-2xl border border-border/70 bg-card space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("storefront.searchPlaceholder")}
                    className="w-full pl-10 rounded-xl h-10 text-xs border-border/70"
                  />
                </div>
                
                <Select value={selectedSort} onValueChange={(val) => { setSelectedSort(val); setPage(1); }}>
                  <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl text-xs font-medium border-border/70">
                    <SelectValue placeholder={t("storefront.sortBy")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="recommended">Terpopuler</SelectItem>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="price-asc">Harga Terendah</SelectItem>
                    <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="font-semibold text-muted-foreground mr-1">Kategori:</span>
                {[
                  { value: "all", label: "Semua" },
                  { value: "agricultural-waste", label: "Limbah Pertanian" },
                  { value: "processed-product", label: "Produk Olahan" },
                  { value: "secondhand", label: "Alat Secondhand" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { setSelectedCategory(cat.value); setPage(1); }}
                    className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                      selectedCategory === cat.value
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Product Feed Grid */}
            {isProductsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 animate-pulse">
                    <div className="aspect-square bg-muted rounded-xl" />
                    <div className="h-4 w-3/4 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : storeProducts.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {storeProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border border-border/70 rounded-2xl bg-card">
                    <span className="text-xs text-muted-foreground font-medium">
                      Halaman {page} dari {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="rounded-xl px-3 text-xs cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Sebelumnya
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="rounded-xl px-3 text-xs cursor-pointer"
                      >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 py-16 text-center bg-card">
                <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-medium">Tidak ada produk ditemukan.</p>
              </div>
            )}
          </div>
        )}

        {/* 3. ABOUT TAB */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 font-sans">
            <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-2xl border border-border/70 bg-card p-6 space-y-5">
                <div className="space-y-2">
                  <h3 className="font-poppins text-base font-bold text-foreground">
                    {t("storefront.aboutTitle")}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {store.description || "Belum ada deskripsi untuk toko ini."}
                  </p>
                </div>

                <Separator className="border-border/50" />

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-poppins">
                    Detail Lokasi & Kontak
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground block">Alamat Toko</span>
                        <span>
                          {store.address || ""}, {store.city || ""}, {store.province || ""} {store.postalCode || ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground block">WhatsApp / Telepon</span>
                        <span>{store.phone || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Side Card Badges */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
                <h3 className="font-poppins text-sm font-bold text-foreground">
                  Status Verifikasi & Komitmen
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/40">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block">Penjual Terverifikasi</span>
                      <span className="text-[11px] text-muted-foreground">Telah memenuhi verifikasi legalitas LoopTani.</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 4. IMPACT TAB */}
        {activeTab === "impact" && (
          <div className="space-y-6 pt-2 font-sans">
            <Card className="rounded-2xl border border-primary/30 bg-card p-6 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
                <div className="space-y-1">
                  <h2 className="font-poppins text-lg font-bold text-foreground">
                    {t("storefront.circularImpact")}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                    {t("storefront.circularImpactDesc")}
                  </p>
                </div>

                <Badge className="bg-primary text-primary-foreground font-bold text-xs px-3 py-1 rounded-full">
                  {t("storefront.comingSoon")}
                </Badge>
              </div>

              {/* Clean 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Limbah Diolah</span>
                  <p className="text-2xl font-bold font-poppins text-foreground">
                    {store.impactStats?.wasteProcessedKg ?? 0} <span className="text-sm font-normal text-muted-foreground">Kg</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Estimasi limbah organik yang didaur ulang.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Produk Organik</span>
                  <p className="text-2xl font-bold font-poppins text-foreground">
                    {store.impactStats?.organicProductsCount ?? store.stats.totalProducts} <span className="text-sm font-normal text-muted-foreground">Unit</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Katalog produk ramah lingkungan aktif.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase block">Petani Terbantu</span>
                  <p className="text-2xl font-bold font-poppins text-foreground">
                    {store.impactStats?.farmersHelpedCount ?? 0} <span className="text-sm font-normal text-muted-foreground">Mitra</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Mitra tani dalam rantai pasok sirkular.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

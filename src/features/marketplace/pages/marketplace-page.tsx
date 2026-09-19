"use client";

import Image from "next/image";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CollectionsProduct from "../components/collections-product";
import {
  FilterSidebarDesktop,
  FilterSheetMobile,
} from "../components/filter-sidebar";
import CategoryFilter from "../components/categories-filter";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type {
  GetProductsParams,
  ProductSortBy,
  ProductCategory,
} from "@/types/api";
import { useProducts } from "../hooks/use-products";
import { useFavoriteProducts } from "../hooks/use-favorite-products";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "recommended", label: "Direkomendasikan" },
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "price-asc", label: "Harga Terendah" },
  { value: "price-desc", label: "Harga Tertinggi" },
];

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL search params directly (single source of truth)
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const sortParam = (searchParams.get("sort") ||
    "recommended") as ProductSortBy;
  const pageParam = Number(searchParams.get("page") || 1);
  const limitParam = Number(searchParams.get("limit") || 24);
  const minPriceParam = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPriceParam = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const provinceParam = searchParams.get("province") || undefined;
  const minSellerRatingParam = searchParams.get("minSellerRating")
    ? Number(searchParams.get("minSellerRating"))
    : undefined;

  // Local state for search query (to show typed text instantly before debounced update)
  const [searchQuery, setSearchQuery] = useState(searchParam);

  // Sync search input if URL changes externally (e.g. on reset)
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Debounced search updates URL params
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearchUpdate = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set("search", query);
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on new search
        router.push(`${pathname}?${params.toString()}`);
      }, 400); // 400ms debounce delay
    },
    [searchParams, pathname, router],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    debouncedSearchUpdate(val);
  };

  const handleSortChange = (value: ProductSortBy) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(pathname);
    setSearchQuery("");
  };

  // Build params for queries
  const isFavoritesTab = categoryParam === "favorites";
  const params: GetProductsParams = {
    page: pageParam,
    limit: limitParam,
    sort: sortParam,
    search: searchParam || undefined,
    category:
      !isFavoritesTab && categoryParam !== "all"
        ? (categoryParam as ProductCategory)
        : undefined,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    province: provinceParam,
    minSellerRating: minSellerRatingParam,
    favoriteOnly: isFavoritesTab ? true : undefined,
  };

  // Load count of products from TanStack Query
  const productsQuery = useProducts({
    params,
    queryConfig: { enabled: !isFavoritesTab },
  });

  const favoritesQuery = useFavoriteProducts({
    params,
    queryConfig: { enabled: isFavoritesTab },
  });

  const activeQuery = isFavoritesTab ? favoritesQuery : productsQuery;
  const total = activeQuery.data?.meta.total ?? 0;
  const totalPages = activeQuery.data?.meta.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", String(newPage));
    router.push(`${pathname}?${p.toString()}`);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30 pb-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <Breadcrumbs items={[{ label: "Marketplace" }]} />

        {/* ── Responsive Hero Banner ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px]">
          <div className="md:col-span-2 h-full rounded-3xl relative overflow-hidden shadow-xs border border-gray-100 dark:border-gray-800">
            <Image
              src="https://res.cloudinary.com/aexisrpt/image/upload/v1786439936/Iklan_web_2.jpg"
              alt="Marketplace Promo Banner"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>
          <div className="hidden md:block h-full relative overflow-hidden rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800">
            <Image
              src="https://res.cloudinary.com/aexisrpt/image/upload/v1786439829/26_2.jpg"
              alt="Kemitraan Mitra Tani"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>
        </div>

        {/* ── Search, Sort, Categories & Filters ── */}
        <div className="space-y-3 sm:space-y-4 bg-white border border-gray-100 p-3 sm:p-5 rounded-2xl sm:rounded-3xl dark:bg-gray-900 dark:border-gray-800 shadow-2xs">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              <Input
                placeholder="Cari limbah pertanian, beras, traktor..."
                className="w-full pl-9 sm:pl-11 h-9 sm:h-10 text-xs sm:text-sm rounded-xl border-gray-200 bg-white"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Sort + Mobile Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <Select value={sortParam} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10 rounded-xl border-gray-200 text-[11px] sm:text-xs font-semibold">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="lg:hidden">
                <FilterSheetMobile />
              </div>
            </div>
          </div>

          <div className="hidden lg:block h-px w-full bg-gray-100 dark:bg-gray-800" />

          {/* Category Pills */}
          <div className="w-full overflow-x-auto scrollbar-none -mx-3 px-3 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0">
            <div className="flex min-w-max pb-1">
              <CategoryFilter
                value={categoryParam}
                onValueChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        {/* ── Main Layout Grid ── */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 pt-2">
          <aside className="hidden lg:block col-span-3">
            <FilterSidebarDesktop />
          </aside>

          <section className="col-span-12 lg:col-span-9 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {isFavoritesTab ? "Favorit Saya" : "Semua Produk"}
                </h2>
                <p className="text-[10.5px] sm:text-xs text-muted-foreground mt-0.5 font-medium">
                  Menampilkan{" "}
                  <span className="font-bold text-primary">{total}</span> produk
                </p>
              </div>
            </div>

            <CollectionsProduct
              params={params}
              onResetFilters={handleResetFilters}
            />

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-5 border border-gray-100 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xs">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium text-center sm:text-left">
                  Menampilkan{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min((pageParam - 1) * limitParam + 1, total)}
                  </span>
                  {" - "}
                  <span className="font-semibold text-foreground">
                    {Math.min(pageParam * limitParam, total)}
                  </span>{" "}
                  dari <span className="font-bold text-primary">{total}</span> produk
                </p>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pageParam <= 1}
                    onClick={() => handlePageChange(pageParam - 1)}
                    className="rounded-lg sm:rounded-xl h-7.5 sm:h-9 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold cursor-pointer border-gray-200 hover:bg-gray-50 dark:border-gray-800"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-0.5 sm:mr-1" />
                    Sebelumnya
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer select-none",
                          p === pageParam
                            ? "bg-primary text-primary-foreground shadow-xs scale-105"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pageParam >= totalPages}
                    onClick={() => handlePageChange(pageParam + 1)}
                    className="rounded-lg sm:rounded-xl h-7.5 sm:h-9 px-2 sm:px-3 text-[10px] sm:text-xs font-semibold cursor-pointer border-gray-200 hover:bg-gray-50 dark:border-gray-800"
                  >
                    Selanjutnya
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5 sm:ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

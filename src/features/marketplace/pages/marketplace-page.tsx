"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import type { GetProductsParams, ProductSortBy, ProductCategory } from "@/types/api";
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
  const sortParam = (searchParams.get("sort") || "recommended") as ProductSortBy;
  const pageParam = Number(searchParams.get("page") || 1);
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
    [searchParams, pathname, router]
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
    limit: 12,
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
              src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783446582/Iklan_web_lsgam6.jpg"
              alt="Marketplace Promo Banner"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>
          <div className="hidden md:block h-full relative overflow-hidden rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800">
            <Image
              src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783444524/26_gg4y6o.jpg"
              alt="Kemitraan Mitra Tani"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>
        </div>

        {/* ── Search, Sort, Categories & Filters ── */}
        <div className="space-y-4 bg-white border border-gray-100 p-4 sm:p-5 rounded-3xl dark:bg-gray-900 dark:border-gray-800 shadow-2xs">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
              <Input
                placeholder="Cari limbah pertanian, beras, traktor..."
                className="w-full pl-11 rounded-xl border-gray-200 bg-white"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Sort + Mobile Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <Select value={sortParam} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-gray-200 text-xs font-semibold">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
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
          <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0">
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

          <section className="col-span-12 lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isFavoritesTab ? "Favorit Saya" : "Semua Produk"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Menampilkan{" "}
                  <span className="font-bold text-primary">{total}</span> produk
                </p>
              </div>
            </div>

            <CollectionsProduct
              params={params}
              onResetFilters={handleResetFilters}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

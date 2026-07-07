"use client";

import Image from "next/image";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-24 dark:bg-gray-950">
      {/* Container Wrapper */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ── Responsive Hero Banner ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
          {/* Main Large Banner */}
          <div className="md:col-span-2 h-full rounded-2xl relative overflow-hidden shadow-xs border border-gray-100 dark:border-gray-800">
            <Image
              src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783446582/Iklan_web_lsgam6.jpg"
              alt="Marketplace Promo Banner"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>

          {/* Secondary Side Banner (Hidden on Mobile) */}
          <div className="hidden md:block h-full relative overflow-hidden rounded-2xl shadow-xs border border-gray-100 dark:border-gray-800">
            <Image
              src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783444524/26_gg4y6o.jpg"
              alt="Kemitraan Mitra Tani"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-102"
            />
          </div>
        </div>

        {/* ── Search, Sort, Categories, & Filters Section ── */}
        <div className="space-y-4 bg-white border border-gray-100 p-4 sm:p-5 rounded-3xl dark:bg-gray-900 dark:border-gray-800 shadow-2xs">
          {/* Search, Sort, and Mobile Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
              <Input
                placeholder="Cari limbah pertanian, pupuk, traktor..."
                className="w-full pl-11 rounded-xl border-gray-200 bg-white"
              />
            </div>

            {/* Actions: Sort + Mobile Filter Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Sort Select */}
              <div className="relative flex-1 sm:flex-initial">
                <Select defaultValue="latest">
                  <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl border-gray-200 text-xs font-semibold">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Terbaru</SelectItem>
                    <SelectItem value="popular">Terpopuler</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Sheet Button (Hidden on Desktop) */}
              <div className="lg:hidden">
                <FilterSheetMobile />
              </div>
            </div>
          </div>

          {/* Divider line for desktop layout */}
          <div className="hidden lg:block h-px w-full bg-gray-100 dark:bg-gray-800" />

          {/* Category Pills (Horizontal Scroll on Mobile) */}
          <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0">
            <div className="flex min-w-max pb-1">
              <CategoryFilter />
            </div>
          </div>
        </div>

        {/* ── Main Layout Grid (Sidebar + Product Collections) ── */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 pt-2">
          {/* Sidebar Filter (Hidden on Mobile/Tablet, sticky on Desktop) */}
          <aside className="hidden lg:block col-span-3">
            <FilterSidebarDesktop />
          </aside>

          {/* Product Grid Content */}
          <section className="col-span-12 lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Semua Produk
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Menampilkan{" "}
                  <span className="font-bold text-primary">128</span> produk
                  pilihan
                </p>
              </div>
            </div>

            {/* Product list collection */}
            <CollectionsProduct />
          </section>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;

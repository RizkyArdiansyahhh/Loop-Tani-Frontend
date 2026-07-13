"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Filter,
  MapPin,
  RotateCcw,
  Star,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const PROVINCES = [
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "DKI Jakarta",
  "DI Yogyakarta",
  "Sumatera Utara",
  "Riau",
];

const RATINGS = [5, 4.5, 4];

function FilterContent({ onApply }: { onApply?: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL values to initialize local states
  const categoryParam = searchParams.get("category") || "all";
  const provinceParam = searchParams.get("province") || "all";
  const ratingParam = searchParams.get("minSellerRating") || "all";
  const minPriceParam = Number(searchParams.get("minPrice") || 0);
  const maxPriceParam = Number(searchParams.get("maxPrice") || 10000000);

  // Local state for price range (to make dragging smooth)
  const [localPriceRange, setLocalPriceRange] = useState<number[]>([
    minPriceParam,
    maxPriceParam,
  ]);

  // Keep local price sync with url changes (e.g. on reset)
  useEffect(() => {
    setLocalPriceRange([minPriceParam, maxPriceParam]);
  }, [minPriceParam, maxPriceParam]);

  const handlePriceChange = (val: number[]) => {
    setLocalPriceRange(val);
  };

  const handlePriceCommit = (val: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", val[0].toString());
    params.set("maxPrice", val[1].toString());
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    if (onApply) onApply();
  };

  const handleCategorySelect = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("category");
    } else {
      params.set("category", val);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    if (onApply) onApply();
  };

  const handleProvinceSelect = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("province");
    } else {
      params.set("province", val);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    if (onApply) onApply();
  };

  const handleRatingSelect = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("minSellerRating");
    } else {
      params.set("minSellerRating", val);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    if (onApply) onApply();
  };

  const handleReset = () => {
    // Navigate to pathname without search parameters
    router.push(pathname);
    if (onApply) onApply();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1 space-y-4">
        <Accordion
          type="multiple"
          defaultValue={["category", "price", "location", "rating"]}
          className="space-y-1"
        >
          {/* Kategori */}
          <AccordionItem value="category">
            <AccordionTrigger className="font-semibold py-3 text-sm">Kategori</AccordionTrigger>
            <AccordionContent className="pt-2">
              <RadioGroup
                value={categoryParam}
                onValueChange={handleCategorySelect}
                className="space-y-2.5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="side-all" />
                  <label htmlFor="side-all" className="text-sm cursor-pointer font-medium">
                    Semua Kategori
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agricultural-waste" id="side-agricultural-waste" />
                  <label htmlFor="side-agricultural-waste" className="text-sm cursor-pointer font-medium">
                    Limbah Pertanian
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="processed-product" id="side-processed-product" />
                  <label htmlFor="side-processed-product" className="text-sm cursor-pointer font-medium">
                    Produk Olahan
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="secondhand" id="side-secondhand" />
                  <label htmlFor="side-secondhand" className="text-sm cursor-pointer font-medium">
                    Alat Secondhand
                  </label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Harga */}
          <AccordionItem value="price">
            <AccordionTrigger className="font-semibold py-3 text-sm">Rentang Harga</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-3">
              <Slider
                value={localPriceRange}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceCommit}
                max={10000000}
                step={10000}
                min={0}
              />
              <div className="flex justify-between items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3 text-xs font-semibold">
                <span className="text-green-700 dark:text-green-400">
                  Rp{localPriceRange[0].toLocaleString("id-ID")}
                </span>
                <span className="text-gray-400">-</span>
                <span className="text-green-700 dark:text-green-400">
                  Rp{localPriceRange[1].toLocaleString("id-ID")}
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Lokasi */}
          <AccordionItem value="location">
            <AccordionTrigger className="font-semibold py-3 text-sm">Lokasi (Provinsi)</AccordionTrigger>
            <AccordionContent className="pt-2">
              <Select value={provinceParam} onValueChange={handleProvinceSelect}>
                <SelectTrigger className="h-10 rounded-xl border-gray-200">
                  <MapPin className="mr-2 h-4 w-4 text-primary shrink-0" />
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Provinsi</SelectItem>
                  {PROVINCES.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Rating */}
          <AccordionItem value="rating">
            <AccordionTrigger className="font-semibold py-3 text-sm">Rating Penjual</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <button
                onClick={() => handleRatingSelect("all")}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-2.5 transition-all text-xs font-semibold",
                  ratingParam === "all"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span>Semua Rating</span>
              </button>
              {RATINGS.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingSelect(rating.toString())}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-2.5 transition-all text-xs font-semibold",
                    ratingParam === rating.toString()
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < Math.floor(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200 dark:text-gray-800"
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-gray-700 dark:text-gray-300">
                      {rating.toFixed(1)}+
                    </span>
                  </div>
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom actions */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-background pt-4 mt-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="h-11 w-full rounded-xl border-gray-200 text-xs font-semibold hover:bg-gray-50"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Semua Filter
        </Button>
      </div>
    </div>
  );
}

// ─── Desktop sidebar (lg+) ────────────────────────────────────────────────────

export function FilterSidebarDesktop() {
  return (
    <Card className="sticky top-24 flex h-[calc(100vh-8rem)] flex-col rounded-2xl shadow-2xs border border-gray-100 dark:border-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 py-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-primary" />
          <CardTitle className="text-base font-bold">Filter Produk</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-5">
        <FilterContent />
      </CardContent>
    </Card>
  );
}

// ─── Mobile filter button + sheet (< lg) ─────────────────────────────────────

export function FilterSheetMobile() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-xl border-gray-200 font-semibold"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-5 pb-5 pt-5 border-t border-gray-100">
        <SheetHeader className="mb-4">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200" />
          <SheetTitle className="flex items-center gap-2 text-left text-base font-bold">
            <Filter className="h-4.5 w-4.5 text-primary" />
            Filter Produk
          </SheetTitle>
        </SheetHeader>
        <FilterContent onApply={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default FilterSidebarDesktop;

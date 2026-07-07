"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
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
  PackageCheck,
  RotateCcw,
  Star,
  Truck,
  SlidersHorizontal,
} from "lucide-react";

// ─── Inner filter content (shared between sidebar & sheet) ────────────────────

function FilterContent({ onApply }: { onApply?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1">
        <Accordion
          type="multiple"
          defaultValue={["price", "location", "rating"]}
          className="space-y-1"
        >
          {/* Harga */}
          <AccordionItem value="price">
            <AccordionTrigger className="font-semibold">Harga</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-3">
              <Slider defaultValue={[2500000]} max={10000000} step={50000} />
              <div className="flex justify-between rounded-lg bg-muted px-3 py-2 text-xs font-medium">
                <span>Rp0</span>
                <span>Rp10.000.000</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Lokasi */}
          <AccordionItem value="location">
            <AccordionTrigger className="font-semibold">Lokasi</AccordionTrigger>
            <AccordionContent className="pt-3">
              <Select>
                <SelectTrigger className="h-11 rounded-xl">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riau">Riau</SelectItem>
                  <SelectItem value="sumbar">Sumatera Barat</SelectItem>
                  <SelectItem value="jambi">Jambi</SelectItem>
                  <SelectItem value="sumut">Sumatera Utara</SelectItem>
                  <SelectItem value="aceh">Aceh</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Rating */}
          <AccordionItem value="rating">
            <AccordionTrigger className="font-semibold">Rating Penjual</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              {[5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  className="flex w-full items-center rounded-xl border px-3 py-2 transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">{rating} ke atas</span>
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Quick Filter */}
        <div className="mt-6 space-y-3 border-t pt-5">
          <h3 className="text-sm font-semibold">Filter Cepat</h3>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              <span className="text-sm">Produk tersedia</span>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span className="text-sm">Gratis Ongkir</span>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="border-t bg-background pt-4 mt-4 space-y-2">
        <Button onClick={onApply} className="h-11 w-full rounded-xl">
          Terapkan Filter
        </Button>
        <Button variant="outline" className="h-11 w-full rounded-xl">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filter
        </Button>
      </div>
    </div>
  );
}

// ─── Desktop sidebar (lg+) ────────────────────────────────────────────────────

export function FilterSidebarDesktop() {
  return (
    <Card className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col rounded-2xl shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <CardTitle>Filter Produk</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6">
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
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-5 pb-0 pt-5">
        <SheetHeader className="mb-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />
          <SheetTitle className="flex items-center gap-2 text-left">
            <Filter className="h-5 w-5 text-primary" />
            Filter Produk
          </SheetTitle>
        </SheetHeader>
        <FilterContent onApply={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// ─── Default export kept for backward compat ─────────────────────────────────
export default FilterSidebarDesktop;

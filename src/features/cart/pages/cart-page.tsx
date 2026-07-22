"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  Info,
  Scale
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "../hooks/use-cart";
import { useUpdateCartItem } from "../hooks/use-update-cart-item";
import { useDeleteCartItem } from "../hooks/use-delete-cart-item";
import { useClearCart } from "../hooks/use-clear-cart";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatWeight(weightGrams: number): string {
  if (weightGrams >= 1000) {
    const kg = weightGrams / 1000;
    return `${kg.toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg`;
  }
  return `${weightGrams} gram`;
}

export function CartPage() {
  const { data: cartData, isLoading, isError, refetch } = useCart();
  const updateMutation = useUpdateCartItem();
  const deleteMutation = useDeleteCartItem();
  const clearMutation = useClearCart();

  // Local state for checkboxes
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Automatically select all available items on first load
  useEffect(() => {
    if (cartData?.items) {
      const initialSelected = new Set<string>();
      cartData.items.forEach((item) => {
        if (item.isAvailable) {
          initialSelected.add(item.id);
        }
      });
      setSelectedIds(initialSelected);
    }
  }, [cartData]);

  // Derived properties
  const availableItems = useMemo(() => {
    return cartData?.items.filter((item) => item.isAvailable) || [];
  }, [cartData]);

  const allAvailableSelected = useMemo(() => {
    if (availableItems.length === 0) return false;
    return availableItems.every((item) => selectedIds.has(item.id));
  }, [availableItems, selectedIds]);

  const someAvailableSelected = useMemo(() => {
    if (availableItems.length === 0) return false;
    return availableItems.some((item) => selectedIds.has(item.id)) && !allAvailableSelected;
  }, [availableItems, selectedIds, allAvailableSelected]);

  // Totals of SELECTED items calculated locally in frontend
  const { selectedCount, selectedSubtotal, selectedWeight } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let weight = 0;

    cartData?.items.forEach((item) => {
      if (item.isAvailable && selectedIds.has(item.id)) {
        count += item.quantity;
        subtotal += item.subtotal;
        weight += item.quantity * item.product.weight;
      }
    });

    return {
      selectedCount: count,
      selectedSubtotal: subtotal,
      selectedWeight: weight,
    };
  }, [cartData, selectedIds]);

  // Handlers
  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (allAvailableSelected) {
      // Uncheck all
      setSelectedIds(new Set());
    } else {
      // Check all available
      const next = new Set<string>();
      availableItems.forEach((item) => next.add(item.id));
      setSelectedIds(next);
    }
  };

  const handleQuantityChange = (id: string, currentQty: number, change: number, stock: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    if (newQty > stock) {
      toast.error(`Kuantitas melampaui batas stok (${stock} unit)`);
      return;
    }
    if (newQty > 999) {
      toast.error("Kuantitas maksimal adalah 999 unit");
      return;
    }
    updateMutation.mutate({ id, quantity: newQty });
  };

  const handleManualQuantityInput = (id: string, val: string, stock: number) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) return;
    if (num > stock) {
      toast.error(`Stok tidak mencukupi, stok maksimal: ${stock}`);
      return;
    }
    if (num > 999) {
      toast.error("Kuantitas maksimal adalah 999 unit");
      return;
    }
    updateMutation.mutate({ id, quantity: num });
  };

  const handleDeleteItem = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleClearCart = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan keranjang belanja?")) {
      clearMutation.mutate();
    }
  };

  const handleCheckout = () => {
    toast.success("Mengarahkan ke Checkout... (Fitur ini akan diimplementasikan pada modul berikutnya)");
  };

  // ─────────────────────────────────────────────
  // RENDER STATES
  // ─────────────────────────────────────────────

  // 1. LOADING SKELETON
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-12 bg-gray-200 rounded-2xl dark:bg-gray-800" />
            <div className="h-32 bg-gray-200 rounded-2xl dark:bg-gray-800" />
            <div className="h-32 bg-gray-200 rounded-2xl dark:bg-gray-800" />
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Gagal Memuat Keranjang
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Terjadi kesalahan saat mengambil data keranjang belanja Anda. Silakan coba kembali.
        </p>
        <Button onClick={() => refetch()} className="w-full">
          Coba Lagi
        </Button>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-primary dark:bg-green-950/20">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Keranjang Belanja Kosong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Anda belum menambahkan produk apa pun ke keranjang belanja Anda. Mari mulai mencari kebutuhan pertanian Anda!
        </p>
        <Button asChild className="w-full py-6 rounded-2xl text-base font-semibold">
          <Link href="/marketplace">Belanja Sekarang</Link>
        </Button>
      </div>
    );
  }

  // 4. MAIN LAYOUT
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Keranjang Belanja</span>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
        Keranjang Belanja
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        {/* LEFT COLUMN: LIST OF ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Controls: Select All & Delete All */}
          <div className="flex items-center justify-between p-4 bg-white border border-gray-150 rounded-2xl shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="select-all"
                checked={allAvailableSelected}
                onCheckedChange={handleToggleAll}
                disabled={availableItems.length === 0}
                className="h-5 w-5 rounded-md border-gray-300 text-primary focus:ring-primary"
              />
              <label 
                htmlFor="select-all" 
                className={`text-sm font-semibold cursor-pointer select-none ${
                  availableItems.length === 0 ? "text-gray-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Pilih Semua ({availableItems.length} produk tersedia)
              </label>
            </div>
            <button
              onClick={handleClearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Kosongkan Keranjang
            </button>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-4">
            {cartData.items.map((item) => {
              const { product, isAvailable, availabilityReason, quantity } = item;

              // Build availability alert warning message
              let warningMessage = "";
              if (!isAvailable) {
                if (availabilityReason === "OUT_OF_STOCK") {
                  warningMessage = "Produk habis";
                } else if (availabilityReason === "ARCHIVED") {
                  warningMessage = "Produk diarsipkan oleh penjual";
                } else if (availabilityReason === "SOLD") {
                  warningMessage = "Produk telah terjual";
                } else if (availabilityReason === "DRAFT") {
                  warningMessage = "Produk tidak tersedia";
                }
              }

              return (
                <div 
                  key={item.id}
                  className={`relative p-5 bg-white border rounded-3xl shadow-sm transition-all duration-200 dark:bg-gray-900 ${
                    isAvailable 
                      ? "border-gray-150 hover:border-green-200 dark:border-gray-800" 
                      : "border-red-150 bg-red-50/5 dark:border-red-950/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Item Checkbox */}
                    <div className="pt-3">
                      <Checkbox 
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => handleToggleItem(item.id)}
                        disabled={!isAvailable}
                        className="h-5 w-5 rounded-md border-gray-300 text-primary focus:ring-primary disabled:opacity-30"
                      />
                    </div>

                    {/* Product Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-800">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Metadata & Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Penjual: <span className="font-semibold text-gray-600 dark:text-gray-300">{product.seller.name}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Scale className="h-3 w-3" />
                            {formatWeight(product.weight)}
                          </p>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Hapus produk"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Pricing and Quantity Selector */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-gray-400">Harga Satuan</p>
                          <p className="text-base font-extrabold text-primary">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-2xl p-1 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                            <button
                              onClick={() => handleQuantityChange(item.id, quantity, -1, product.stock)}
                              disabled={!isAvailable || quantity <= 1}
                              className="h-8 w-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-150 disabled:opacity-30 dark:hover:bg-gray-800 transition-all"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => handleManualQuantityInput(item.id, e.target.value, product.stock)}
                              disabled={!isAvailable}
                              className="w-12 text-center bg-transparent border-0 font-bold text-gray-900 focus:outline-none focus:ring-0 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, quantity, 1, product.stock)}
                              disabled={!isAvailable || quantity >= product.stock}
                              className="h-8 w-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-150 disabled:opacity-30 dark:hover:bg-gray-800 transition-all"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total Subtotal */}
                        <div className="space-y-0.5 text-right">
                          <p className="text-sm font-medium text-gray-400">Total Harga</p>
                          <p className="text-base font-extrabold text-gray-900 dark:text-white">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unavailable Warnings */}
                  {!isAvailable && (
                    <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-2xl text-xs font-semibold dark:bg-red-950/20 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{warningMessage || "Produk tidak tersedia untuk dibeli saat ini"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-gray-150 rounded-3xl shadow-sm space-y-6 sticky top-24 dark:bg-gray-900 dark:border-gray-800">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight border-b pb-4 border-gray-100 dark:border-gray-800">
              Ringkasan Belanja
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Total Barang</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedCount} item
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Total Berat Barang</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" />
                  {formatWeight(selectedWeight)}
                </span>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Total Belanja</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    {formatPrice(selectedSubtotal)}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={selectedCount === 0}
              className="w-full py-6 rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              Checkout ({selectedCount})
            </Button>

            <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-2xl text-xs dark:bg-blue-950/20 dark:text-blue-400 leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Pajak, asuransi, dan ongkos pengiriman akan dikalkulasi di tahap Checkout berikutnya.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

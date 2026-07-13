"use client";

import Image from "next/image";
import { BadgeCheck, Star, MapPin, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { useProductById } from "../hooks/use-product-by-id";
import BadgeProduct from "@/components/shared/badge-product";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFavorite } from "../hooks/use-favorite";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ id }: { id: string }) {
  const { data: product, isLoading, isError } = useProductById({ id });
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const { toggleFavorite } = useFavorite();
  const addToCartMutation = useAddToCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-6 flex justify-center pt-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground font-semibold">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-6 flex flex-col items-center pt-20">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Gagal memuat produk</h1>
        <p className="text-muted-foreground mb-6">Produk mungkin sudah dihapus atau tidak tersedia.</p>
        <Button onClick={() => window.history.back()} className="rounded-xl">
          Kembali
        </Button>
      </div>
    );
  }

  const sortedImages = [...product.images].sort((a, b) => a.order - b.order);
  const activeImage = sortedImages[activeImageIdx]?.imageUrl ?? "/images/placeholder.png";

  return (
    <div className="min-h-screen bg-gray-50/30 pb-24 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Marketplace", href: "/marketplace" },
            { label: product.title },
          ]}
        />

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* ── IMAGE GALLERY ── */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-800">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                <button
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-md transition-all hover:scale-115 shadow-md active:scale-95"
                  onClick={() => toggleFavorite(product.id, product.isFavorite)}
                  aria-label="Tambah ke wishlist"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                    )}
                  />
                </button>
              </div>

              {sortedImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {sortedImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        "relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                        activeImageIdx === idx
                          ? "border-primary shadow-md"
                          : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
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

            {/* ── PRODUCT INFO ── */}
            <div className="flex flex-col">
              <div className="space-y-2 mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <BadgeProduct category={product.category} className="static" />
                  {product.isFeatured && (
                    <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-800 border border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50">
                      <Star className="h-3.5 w-3.5 fill-yellow-600 text-yellow-600 dark:fill-yellow-500" />
                      Unggulan
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {product.title}
                </h1>

                <p className="text-3xl font-bold text-green-700 dark:text-green-500">
                  Rp{product.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex flex-col gap-4 py-6 border-y border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold dark:bg-green-950/30 dark:text-green-400">
                      {product.seller.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {product.seller.name}
                        </span>
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex flex-col gap-1 mt-0.5">
                        {product.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span>{product.location}</span>
                          </div>
                        )}
                        {product.sellerRating > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 rounded-full w-max font-bold">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>
                              {product.sellerRating.toFixed(1)} ({product.totalReview} Ulasan)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full border-gray-200">
                    Kunjungi Toko
                  </Button>
                </div>
              </div>

              <div className="py-6 space-y-4 flex-1">
                <h3 className="font-semibold text-lg">Detail Produk</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-muted-foreground">Kondisi</div>
                  <div className="font-semibold text-right sm:text-left">
                    {product.condition === "NEW" ? "Baru" : "Bekas"}
                  </div>

                  <div className="text-muted-foreground">Stok</div>
                  <div className="font-semibold text-right sm:text-left">
                    {product.stock} unit tersisa
                  </div>

                  <div className="text-muted-foreground">Kategori</div>
                  <div className="font-semibold text-right sm:text-left capitalize text-primary">
                    {product.category.replace("-", " ")}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-semibold mb-2">Deskripsi</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-6 mt-auto border-t border-gray-100 dark:border-gray-800 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-primary text-primary hover:bg-primary/5"
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                  onClick={() => addToCartMutation.mutate({ productId: product.id, quantity: 1 })}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {addToCartMutation.isPending ? "Menambahkan..." : "Keranjang"}
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-xl" 
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                  onClick={() => addToCartMutation.mutate(
                    { productId: product.id, quantity: 1 },
                    { onSuccess: () => router.push("/cart") }
                  )}
                >
                  Beli Sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

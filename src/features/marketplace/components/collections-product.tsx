"use client";

import CardProduct from "./card-product";
import { useProducts } from "../hooks/use-products";
import { useFavoriteProducts } from "../hooks/use-favorite-products";
import type { GetProductsParams } from "@/types/api";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle, Inbox } from "lucide-react";

interface CollectionsProductProps {
  params: GetProductsParams;
  onResetFilters?: () => void;
}

const ProductSkeleton = () => (
  <div className="rounded-2xl border border-border bg-background overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded dark:bg-gray-800 w-1/3" />
      <div className="h-4 bg-gray-200 rounded dark:bg-gray-800 w-3/4" />
      <div className="h-3 bg-gray-200 rounded dark:bg-gray-800 w-1/2" />
      <div className="h-5 bg-gray-200 rounded dark:bg-gray-800 w-1/4 mt-4" />
    </div>
  </div>
);

const CollectionsProduct = ({ params, onResetFilters }: CollectionsProductProps) => {
  const isFavoritesOnly = params.favoriteOnly === true;

  // Fetch using the appropriate hook depending on the active tab
  const productsQuery = useProducts({
    params,
    queryConfig: { enabled: !isFavoritesOnly },
  });

  const favoritesQuery = useFavoriteProducts({
    params,
    queryConfig: { enabled: isFavoritesOnly },
  });

  const query = isFavoritesOnly ? favoritesQuery : productsQuery;
  const { data, isLoading, isError, refetch } = query;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-gray-100 rounded-3xl dark:bg-gray-900 dark:border-gray-800 shadow-2xs">
        <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Gagal memuat produk</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Terjadi kesalahan koneksi saat memuat data. Silakan coba beberapa saat lagi.
        </p>
        <Button onClick={() => refetch()} className="rounded-xl px-6">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const products = data?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-gray-100 rounded-3xl dark:bg-gray-900 dark:border-gray-800 shadow-2xs">
        <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Produk tidak ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {isFavoritesOnly
            ? "Belum ada produk yang Anda sukai. Telusuri marketplace untuk menyukai produk!"
            : "Coba ubah kata kunci pencarian atau reset filter untuk melihat produk lainnya."}
        </p>
        {onResetFilters && !isFavoritesOnly && (
          <Button onClick={onResetFilters} variant="outline" className="rounded-xl px-5 border-gray-200">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <CardProduct key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CollectionsProduct;

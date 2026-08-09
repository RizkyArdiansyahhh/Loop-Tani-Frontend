"use client";

import { useTranslations } from "next-intl";
import { useFavoriteProducts } from "@/features/marketplace/hooks/use-favorite-products";
import CardProduct from "@/features/marketplace/components/card-product";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function FavoritesPage() {
  const t = useTranslations("profile.favorites");
  const { data, isLoading, isError, refetch } = useFavoriteProducts({ params: {} });

  const products = data?.data || [];

  return (
    <div className="space-y-6 font-sans">
      {/* ── HEADER HALAMAN MINIMALIS ── */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4 font-poppins">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground pt-0.5">
            {t("description")}
          </p>
        </div>
        {products.length > 0 && (
          <span className="text-xs font-bold text-muted-foreground font-mono">
            {products.length} Produk
          </span>
        )}
      </div>

      {/* ── ERROR STATE ── */}
      {isError ? (
        <div className="bg-card border border-border/60 rounded-2xl p-8 text-center space-y-3 font-poppins">
          <p className="text-xs font-bold text-foreground">Gagal memuat produk favorit</p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold rounded-xl border-border/60"
          >
            Coba Lagi
          </Button>
        </div>
      ) : isLoading ? (
        /* ── LOADING SKELETON ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-muted/30 overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted/60" />
              <div className="p-4 space-y-2 font-poppins">
                <div className="h-3 bg-muted/80 rounded w-1/3" />
                <div className="h-4 bg-muted/80 rounded w-3/4" />
                <div className="h-3 bg-muted/80 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* ── EMPTY STATE MINIMALIS (TANPA BANYAK IKON) ── */
        <div className="bg-card border border-border/60 rounded-2xl p-10 text-center space-y-3 font-poppins">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">{t("emptyTitle")}</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {t("emptyDesc")}
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-5 rounded-xl text-xs font-bold cursor-pointer shadow-xs">
            <Link href="/marketplace">
              {t("exploreCta")}
            </Link>
          </Button>
        </div>
      ) : (
        /* ── PRODUCT GRID ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

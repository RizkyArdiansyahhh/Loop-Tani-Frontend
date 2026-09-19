"use client";

import Image from "next/image";
import { Heart, CheckCircle2, BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlareHover from "@/components/ui/glare-hover";
import BadgeProduct from "@/components/shared/badge-product";
import type { ProductSummary } from "@/types/api";
import Link from "next/link";
import { useFavorite } from "../hooks/use-favorite";
import { cn } from "@/lib/utils";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";

interface CardProductProps {
  product: ProductSummary;
}

const CardProduct = ({ product }: CardProductProps) => {
  const addToCartMutation = useAddToCart();
  const {
    id,
    images,
    category,
    title,
    price,
    seller,
    isFeatured,
    sellerRating,
    totalReview,
    location,
    isFavorite,
  } = product;

  const { toggleFavorite } = useFavorite();

  // Gambar diurutkan berdasarkan order dari backend (order=0 adalah utama)
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const primaryImage = sorted[0]?.imageUrl ?? "/images/placeholder.png";
  const secondaryImage = sorted[1]?.imageUrl ?? primaryImage;

  return (
    <Link
      href={`/marketplace/${id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:shadow-2xl"
    >
      <div>
        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={title}
            fill
            priority={false}
            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
          />

          {/* Secondary Image */}
          <Image
            src={secondaryImage}
            alt={title}
            fill
            priority={false}
            className="object-cover opacity-0 scale-105 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

          {/* Glare */}
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.9}
            glareAngle={-35}
            glareSize={250}
            transitionDuration={600}
          />

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-600 text-white font-black text-[9px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
                Stok Habis
              </span>
            </div>
          )}

          {/* Category Badge */}
          <BadgeProduct category={category} />

          {/* Favorite button */}
          <button
            className="absolute right-1.5 top-1.5 sm:right-3 sm:top-3 z-20 flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-xs active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(id, isFavorite);
            }}
          >
            <Heart
              className={cn(
                "h-3 w-3 sm:h-4.5 sm:w-4.5 transition-colors duration-300",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              )}
            />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-0.5 sm:space-y-2 p-1.5 sm:p-3.5">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <BadgeCheck className="h-2.5 w-2.5 sm:h-4 sm:w-4 text-green-600 shrink-0" />
              <span className="text-[9px] sm:text-xs font-semibold truncate text-gray-700 dark:text-gray-300">
                {seller.name}
              </span>
            </div>
            {sellerRating > 0 && (
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 text-[8px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-1 sm:px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-2 w-2 sm:h-3.5 sm:w-3.5 text-emerald-600" />
                <span>{sellerRating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal hidden xs:inline">({totalReview})</span>
              </div>
            )}
          </div>

          <h3 className="line-clamp-2 text-[10px] sm:text-sm md:text-base font-semibold leading-3.5 sm:leading-normal text-foreground group-hover:text-primary transition-colors min-h-7 sm:min-h-10">
            {title}
          </h3>

          {/* Location & Stock Badge */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 pt-0.5 sm:pt-1 text-[8.5px] sm:text-xs">
            {location ? (
              <div className="flex items-center gap-0.5 sm:gap-1 text-muted-foreground min-w-0">
                <MapPin className="h-2 w-2 sm:h-3.5 sm:w-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            ) : <div />}

            {product.stock > 0 ? (
              <span className="text-[8.5px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                Stok: {product.stock}
              </span>
            ) : (
              <span className="text-[8.5px] sm:text-[11px] font-bold text-red-500 shrink-0">
                Habis
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PRICE & ACTION */}
      <div className="w-full flex flex-row justify-between items-center p-1.5 sm:p-3.5 pt-0 gap-1 sm:gap-1.5">
        <div className="min-w-0">
          <p className="text-[10.5px] sm:text-base md:text-lg font-bold text-green-700 dark:text-green-500 truncate">
            Rp{price.toLocaleString("id-ID")}
          </p>
        </div>
        <Button
          className="px-2 sm:px-4 rounded-full font-semibold h-6 sm:h-8.5 text-[9px] sm:text-xs shrink-0 cursor-pointer"
          disabled={product.stock === 0 || addToCartMutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCartMutation.mutate({ productId: id, quantity: 1 });
          }}
        >
          {product.stock === 0 ? "Habis" : addToCartMutation.isPending ? "..." : "Beli"}
        </Button>
      </div>
    </Link>
  );
};

export default CardProduct;

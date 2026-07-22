"use client";

import Image from "next/image";
import { Heart, Star, BadgeCheck, MapPin } from "lucide-react";
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

          {/* Category Badge */}
          <BadgeProduct category={category} />

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-3 right-16 z-20 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-yellow-900 shadow-sm border border-yellow-300">
              <Star className="h-3 w-3 fill-yellow-900" />
              Unggulan
            </div>
          )}

          {/* Favorite button */}
          <button
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-md transition-all duration-300 hover:scale-115 shadow-md active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(id, isFavorite);
            }}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors duration-300",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              )}
            />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <BadgeCheck className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-sm font-semibold truncate text-gray-700 dark:text-gray-300">
                {seller.name}
              </span>
            </div>
            {sellerRating > 0 && (
              <div className="flex items-center gap-0.5 shrink-0 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{sellerRating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({totalReview})</span>
              </div>
            )}
          </div>

          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors min-h-11">
            {title}
          </h3>

          {/* Location Badge */}
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
              <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* PRICE & ACTION */}
      <div className="w-full flex flex-row justify-between items-center p-4 pt-0">
        <div>
          <p className="text-lg font-bold text-green-700 dark:text-green-500">
            Rp{price.toLocaleString("id-ID")}
          </p>
        </div>
        <Button
          className="px-6 rounded-full font-semibold h-9 text-xs"
          disabled={product.stock === 0 || addToCartMutation.isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCartMutation.mutate({ productId: id, quantity: 1 });
          }}
        >
          {addToCartMutation.isPending ? "..." : "Beli"}
        </Button>
      </div>
    </Link>
  );
};

export default CardProduct;

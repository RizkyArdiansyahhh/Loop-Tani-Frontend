"use client";

import Image from "next/image";
import { Heart, MapPin, Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/types/api";
import GlareHover from "@/components/ui/glare-hover";
import BadgeProduct from "@/components/shared/badge-product";

interface CardProductProps {
  image: ProductImage[];
  category: string;
  name: string;
  rating: number;
  price: number;
  location: string;
  seller: string;
}

const CardProduct = ({
  image,
  category,
  name,
  rating,
  price,
  location,
  seller,
}: CardProductProps) => {
  const primaryImage =
    image.find((img) => img.isPrimary)?.url ??
    image[0]?.url ??
    "/images/placeholder.png";

  const secondaryImage =
    image.find((img) => !img.isPrimary)?.url ?? image[1]?.url ?? primaryImage;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300  hover:shadow-2xl">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden">
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={name}
          fill
          priority={false}
          className="
            object-cover
            transition-all
            duration-700
            ease-in-out
            group-hover:scale-110
            group-hover:opacity-0
          "
        />

        {/* Secondary Image */}
        <Image
          src={secondaryImage}
          alt={name}
          fill
          priority={false}
          className="
            object-cover
            opacity-0
            scale-105
            transition-all
            duration-700
            ease-in-out
            group-hover:opacity-100
            group-hover:scale-110
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Glare */}
        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.9}
          glareAngle={-35}
          glareSize={250}
          transitionDuration={600}
        />

        {/* Category */}
        <BadgeProduct category="agricultural-waste" />

        {/* Wishlist */}
        <button className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-all duration-300 hover:scale-110">
          <Heart className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{seller}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>
        </div>
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
          {name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="w-full flex flex-row justify-between items-center">
          <div>
            <p className="text-lg font-bold text-green-700">
              Rp{price.toLocaleString("id-ID")}
            </p>
          </div>
          <Button className="px-10 rounded-full font-semibold ">Beli</Button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;

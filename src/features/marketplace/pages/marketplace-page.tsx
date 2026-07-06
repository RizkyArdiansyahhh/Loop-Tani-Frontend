import Image from "next/image";
import CardProduct from "../components/card-product";
import CollectionsProduct from "../components/collections-product";
import FilterSidebar from "../components/filter-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryFilter from "../components/categories-filter";

const MarketplacePage = () => {
  return (
    <div className="flex flex-col">
      <div className="h-[45vh] w-full  flex flex-row gap-2">
        <div className="w-2/3 h-full rounded-md relative overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783277903/sushanta-rokka-YFWPX3hamKw-unsplash_iyuxjz.jpg"
            alt="Logo"
            fill
            className="object-cover object-center"
          ></Image>
        </div>
        <div className="w-1/3 h-full relative overflow-hidden rounded-md">
          <Image
            src="https://res.cloudinary.com/dy9gtwsh7/image/upload/v1783278437/pexels-gustavo-fring-4975402_d3gksb.jpg"
            alt="Logo"
            fill
            className="object-cover object-center"
          ></Image>
        </div>
      </div>
      <div className=" py-6">
        <div className="flex flex-row h-fit w-full gap-3 items-center  mb-4">
          <CategoryFilter />
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari limbah pertanian, pupuk, traktor..."
              className=" rounded-md pl-12"
            />
          </div>
          <Select defaultValue="latest">
            <SelectTrigger className="w-45 !h-full rounded-md">
              <SelectValue />
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
        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-3">
            <FilterSidebar />
          </aside>

          <section className="col-span-9 space-y-6">
            {/* Total */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Semua Produk</h2>

                <p className="text-sm text-muted-foreground">
                  Menampilkan{" "}
                  <span className="font-semibold text-primary">128</span> produk
                </p>
              </div>
            </div>

            {/* Product */}
            <CollectionsProduct />
          </section>
        </div>
      </div>
    </div>
  );
};
export default MarketplacePage;

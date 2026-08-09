"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/api";
import { Link } from "@/i18n/navigation";
import { Search, MoreVertical, Edit2, Trash2, Eye, EyeOff, Power, Package, Plus } from "lucide-react";

interface SellerProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStatus: (product: Product) => void;
  onOpenCreateModal: () => void;
}

export function SellerProductsTable({
  products,
  isLoading,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
  onOpenCreateModal,
}: SellerProductsTableProps) {
  const t = useTranslations("seller.products");
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState<"ALL" | "ACTIVE" | "LOW_STOCK" | "DRAFT">("ALL");

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeTabFilter === "ACTIVE") return p.status === "ACTIVE";
      if (activeTabFilter === "DRAFT") return p.status === "DRAFT";
      if (activeTabFilter === "LOW_STOCK") return p.stock < 5;
      return true;
    });
  }, [products, activeTabFilter]);

  // TanStack Table Column Definitions
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Produk",
        cell: ({ row }) => {
          const product = row.original;
          const thumbnail = product.images?.[0]?.imageUrl;

          return (
            <div className="flex items-center gap-3 py-1 font-poppins">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-muted/40 border border-border/60 shrink-0 flex items-center justify-center">
                {thumbnail ? (
                  <img src={thumbnail} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="font-bold text-xs text-foreground truncate max-w-[220px] sm:max-w-[300px]">
                  {product.title}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  SKU: {product.slug}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-[10px] font-semibold rounded-lg bg-primary/10 text-primary border-primary/20 font-poppins">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: "price",
        header: "Harga Jual",
        cell: ({ row }) => {
          const unit = row.original.unit || "kg";
          return (
            <div className="space-y-0.5 font-poppins">
              <span className="font-bold text-xs font-mono text-foreground block">
                {formatCurrency(Number(row.original.price))}
              </span>
              <span className="text-[10px] text-muted-foreground block font-sans">
                per {unit}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "stock",
        header: "Stok",
        cell: ({ row }) => {
          const stock = row.original.stock;
          const unit = row.original.unit || "unit";
          const isLow = stock < 5;
          return (
            <Badge
              variant="outline"
              className={`text-[10px] font-mono font-bold rounded-md font-poppins ${
                isLow
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  : "bg-muted/40 text-foreground border-border/60"
              }`}
            >
              {stock} {unit} {isLow && "(Stok Rendah)"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.status === "ACTIVE";
          return (
            <Badge
              variant="outline"
              className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 font-poppins ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground border-border/60"
              }`}
            >
              {isActive ? "Aktif" : "Draft"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const product = row.original;
          const isActive = product.status === "ACTIVE";

          return (
            <div className="flex items-center gap-1">
              {/* Preview product on marketplace */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                title="Lihat Produk di Marketplace"
                className="h-8 w-8 rounded-lg cursor-pointer text-muted-foreground hover:text-primary"
              >
                <Link href={`/marketplace/${product.id}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </Button>

              {/* Edit product */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditProduct(product)}
                title="Edit Produk"
                className="h-8 w-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>

              {/* Toggle status (Active / Draft) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(product)}
                title={isActive ? "Ubah ke Draft (Sembunyikan)" : "Aktifkan Produk (Publikasi)"}
                className={`h-8 w-8 rounded-lg cursor-pointer ${
                  isActive
                    ? "text-emerald-600 hover:text-amber-600"
                    : "text-amber-600 hover:text-emerald-600"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
              </Button>

              {/* Delete product */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteProduct(product.id)}
                title="Hapus Produk"
                className="h-8 w-8 rounded-lg cursor-pointer text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEditProduct, onDeleteProduct, onToggleStatus]
  );

  // TanStack Table Instance
  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Tokopedia Style Filter Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border/70 p-4 rounded-2xl shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTabFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabFilter === "ALL"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {t("tabs.all", { count: products.length })}
          </button>

          <button
            onClick={() => setActiveTabFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabFilter === "ACTIVE"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {t("tabs.active", { count: products.filter((p) => p.status === "ACTIVE").length })}
          </button>

          <button
            onClick={() => setActiveTabFilter("LOW_STOCK")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabFilter === "LOW_STOCK"
                ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {t("tabs.lowStock", { count: products.filter((p) => p.stock < 5).length })}
          </button>

          <button
            onClick={() => setActiveTabFilter("DRAFT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTabFilter === "DRAFT"
                ? "bg-muted text-foreground border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {t("tabs.draft", { count: products.filter((p) => p.status === "DRAFT").length })}
          </button>
        </div>

        {/* Right Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 text-xs h-9 rounded-xl border-border/60"
          />
        </div>
      </div>

      {/* TanStack Table Container */}
      <div className="border border-border/70 rounded-2xl bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/30 border-b border-border/40 text-muted-foreground font-semibold">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3.5 px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-muted-foreground text-xs">
                    {t("table.loading")}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3.5 px-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-muted-foreground text-xs space-y-1">
                    <p className="font-semibold text-foreground">{t("table.emptyTitle")}</p>
                    <p className="text-[11px]">{t("table.emptyDesc")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TanStack Table Pagination Bar */}
        <div className="flex items-center justify-between p-3.5 px-4 border-t border-border/40 bg-muted/10 text-xs text-muted-foreground">
          <span>
            {t("table.showing", { showing: table.getRowModel().rows.length, total: filteredProducts.length })}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 text-xs rounded-xl cursor-pointer"
            >
              {t("table.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 text-xs rounded-xl cursor-pointer"
            >
              {t("table.next")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

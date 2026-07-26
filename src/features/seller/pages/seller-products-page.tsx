"use client";

import { useState } from "react";
import { useProducts } from "@/features/marketplace/hooks/use-products";
import { useSellerMe } from "../hooks/use-seller-me";
import { useDeleteProduct } from "@/features/marketplace/hooks/use-delete-product";
import { useUpdateProduct } from "@/features/marketplace/hooks/use-update-product";
import { SellerProductsTable } from "../components/seller-products-table";
import { ProductFormModal } from "../components/product-form-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Sparkles, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/api";
import { toast } from "sonner";

export function SellerProductsPage() {
  const t = useTranslations("seller.products");
  const { data: sellerMe } = useSellerMe();
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const sellerUserId = (sellerMe as any)?.userId || sellerMe?.id;

  // Fetch seller's products via TanStack Query
  const { data: productsData, isLoading } = useProducts({
    params: {
      sellerId: sellerUserId,
      limit: 100,
      includeOutOfStock: true,
    },
    queryConfig: { enabled: !!sellerUserId },
  });

  const products = productsData?.data || [];

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm(t("table.deleteConfirm"))) {
      deleteMutation.mutate(productId, {
        onSuccess: () => toast.success(t("table.deleteSuccess", { fallback: "Produk berhasil dihapus" })),
        onError: () => toast.error(t("table.deleteError", { fallback: "Gagal menghapus produk" })),
      });
    }
  };

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    updateMutation.mutate(
      { id: product.id, payload: { status: newStatus as any } },
      {
        onSuccess: () => toast.success(t("table.statusUpdated", { fallback: "Status produk diperbarui" })),
        onError: () => toast.error(t("table.statusUpdateError", { fallback: "Gagal mengubah status produk" })),
      }
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header Banner (Tokopedia Seller Style) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border/70 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <ShoppingBag className="w-4 h-4" />
            <span>{t("subtitle")}</span>
          </div>
          <h1 className="text-xl font-bold font-poppins text-foreground tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl h-9.5 px-5 gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t("createButton")}
        </Button>
      </div>

      {/* ── TanStack Table Products Component ── */}
      <SellerProductsTable
        products={products}
        isLoading={isLoading}
        onEditProduct={handleEdit}
        onDeleteProduct={handleDelete}
        onToggleStatus={handleToggleStatus}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* ── Product Add/Edit Form Modal ── */}
      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProvinceSelect } from "@/features/address/components/province-select";
import { RegencySelect } from "@/features/address/components/regency-select";
import { useCreateProduct } from "@/features/marketplace/hooks/use-create-product";
import { useUpdateProduct } from "@/features/marketplace/hooks/use-update-product";
import type { Product, ProductCategory, ProductCondition, ProductStatus } from "@/types/api";
import { toast } from "sonner";
import { Upload, X, Package, Tag, Scale, MapPin, CheckCircle2, Image as ImageIcon } from "lucide-react";

const productSchema = z.object({
  title: z.string().min(3, "Nama produk minimal 3 karakter").max(120),
  category: z.string().min(1, "Kategori harus dipilih"),
  unit: z.string().default("kg"),
  price: z.coerce.number().min(100, "Harga minimal Rp 100"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  weight: z.coerce.number().min(10, "Berat minimal 10 gram").default(1000),
  condition: z.enum(["NEW", "USED"]).default("NEW"),
  status: z.enum(["ACTIVE", "DRAFT"]).default("ACTIVE"),
  province: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormModal({ open, onOpenChange, product }: ProductFormModalProps) {
  const t = useTranslations("seller.products.modal");
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [images, setImages] = useState<Array<{ imageUrl: string; order: number }>>([]);
  const [selectedProvince, setSelectedProvince] = useState<{ id: string; name: string } | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<{ id: string; name: string } | null>(null);

  const isEditing = !!product;

  const form = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      category: "AGRICULTURAL_WASTE",
      unit: "kg",
      price: 15000,
      stock: 10,
      weight: 1000,
      condition: "NEW",
      status: "ACTIVE",
      province: "",
      city: "",
      description: "",
    },
  });

  // Populate data when editing
  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        category: product.category || "AGRICULTURAL_WASTE",
        unit: product.unit || "kg",
        price: Number(product.price),
        stock: product.stock,
        weight: (product as any).weight || 1000,
        condition: (product.condition as any) || "NEW",
        status: (product.status as any) || "ACTIVE",
        province: product.province || "",
        city: product.city || "",
        description: product.description || "",
      });
      if (product.images && product.images.length > 0) {
        setImages(product.images.map((img, i) => ({ imageUrl: img.imageUrl, order: i })));
      } else {
        setImages([]);
      }
    } else {
      form.reset({
        title: "",
        category: "AGRICULTURAL_WASTE",
        unit: "kg",
        price: 15000,
        stock: 10,
        weight: 1000,
        condition: "NEW",
        status: "ACTIVE",
        province: "",
        city: "",
        description: "",
      });
      setImages([]);
      setSelectedProvince(null);
      setSelectedRegency(null);
    }
  }, [product, form, open]);

  // Handle Multi-file image upload
  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Maksimal 5 foto produk");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Format file harus berupa gambar");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          setImages((prev) => [
            ...prev,
            { imageUrl: base64Url, order: prev.length },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (values: any) => {
    if (images.length === 0) {
      toast.error("Wajib mengunggah minimal 1 foto produk");
      return;
    }

    const payload = {
      ...values,
      status: (values.status || "ACTIVE") as ProductStatus,
      category: values.category as ProductCategory,
      condition: values.condition as ProductCondition,
      images,
    };

    if (isEditing && product) {
      updateMutation.mutate(
        { id: product.id, payload: payload as any },
        {
          onSuccess: () => {
            toast.success("Produk berhasil diperbarui");
            onOpenChange(false);
          },
          onError: (err) => {
            toast.error(err.message || "Gagal memperbarui produk");
          },
        }
      );
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => {
          toast.success("Produk baru berhasil ditambahkan");
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(err.message || "Gagal membuat produk");
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 font-sans shadow-xl border-border/60">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Package className="w-4 h-4" />
            <span>{t("badge")}</span>
          </div>
          <DialogTitle className="text-xl font-bold font-poppins text-foreground">
            {isEditing ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing ? t("editDesc") : t("createDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {/* ── SEKSI 1: FOTO & NAMA PRODUK ── */}
          <div className="bg-card border border-border/60 p-5 rounded-2xl space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/40 pb-2.5">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>{t("sec1")}</span>
            </div>

            {/* Multi-File Image Upload Zone */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{t("photoLabel")} <span className="text-destructive">*</span></span>
                <span className="text-[11px] font-normal text-muted-foreground">{t("photoUploaded", { count: images.length })}</span>
              </FieldLabel>

              {/* Thumbnail Preview Cards */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 my-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border/60 group bg-muted/30">
                    <img src={img.imageUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <Badge className="absolute bottom-1.5 left-1.5 text-[9px] px-1.5 py-0 bg-primary text-primary-foreground font-bold rounded-md">
                        Utama
                      </Badge>
                    )}
                  </div>
                ))}

                {/* Add File Upload Trigger Box */}
                {images.length < 5 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-border/80 hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-all bg-muted/20 hover:bg-primary/5 text-muted-foreground hover:text-primary">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Tambah Foto</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFilesChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <FieldDescription className="text-[11px]">
                {t("photoHint")}
              </FieldDescription>
            </Field>

            {/* Product Title */}
            <Field>
              <FieldLabel htmlFor="title" className="text-xs font-semibold text-foreground">
                {t("titleLabel")} <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                placeholder={t("titlePlaceholder")}
                {...form.register("title")}
                className="text-xs h-11 rounded-xl border-border/60"
              />
              <FieldError errors={[form.formState.errors.title as any]} />
            </Field>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field>
                <FieldLabel htmlFor="category" className="text-xs font-semibold text-foreground">
                  {t("categoryLabel")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={form.watch("category")}
                  onValueChange={(val) => form.setValue("category", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-11 text-xs rounded-xl border-border/60">
                    <SelectValue placeholder={t("categoryLabel")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs font-sans">
                    <SelectItem value="AGRICULTURAL_WASTE">Limbah Pertanian</SelectItem>
                    <SelectItem value="PROCESSED_PRODUCT">Produk Olahan</SelectItem>
                    <SelectItem value="SECONDHAND">Barang Bekas / Secondhand</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.category as any]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="condition" className="text-xs font-semibold text-foreground">
                  {t("conditionLabel")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={form.watch("condition")}
                  onValueChange={(val) => form.setValue("condition", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-11 text-xs rounded-xl border-border/60">
                    <SelectValue placeholder={t("conditionLabel")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs font-sans">
                    <SelectItem value="NEW">Baru / Segar</SelectItem>
                    <SelectItem value="USED">Olahan / Kering / Bekas</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* ── SEKSI 2: HARGA, SATUAN & STOK ── */}
          <div className="bg-card border border-border/60 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/40 pb-2.5">
              <Tag className="w-4 h-4 text-primary" />
              <span>{t("sec2")}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field>
                <FieldLabel htmlFor="price" className="text-xs font-semibold text-foreground">
                  {t("priceLabel")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="price"
                  type="number"
                  placeholder="15000"
                  {...form.register("price")}
                  className="text-xs h-11 rounded-xl font-mono border-border/60"
                />
                <FieldError errors={[form.formState.errors.price as any]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="unit" className="text-xs font-semibold text-foreground">
                  {t("unitLabel")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={form.watch("unit")}
                  onValueChange={(val) => form.setValue("unit", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-11 text-xs rounded-xl border-border/60">
                    <SelectValue placeholder={t("unitLabel")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs font-sans">
                    <SelectItem value="kg">Kg (Kilogram)</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="karung">Karung / Sak</SelectItem>
                    <SelectItem value="ikat">Ikat / Dosis</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                    <SelectItem value="pcs">Pcs / Paket</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="stock" className="text-xs font-semibold text-foreground">
                  {t("stockLabel")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  placeholder="10"
                  {...form.register("stock")}
                  className="text-xs h-11 rounded-xl font-mono border-border/60"
                />
                <FieldError errors={[form.formState.errors.stock as any]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="weight" className="text-xs font-semibold text-foreground">
                  {t("weightLabel")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="weight"
                  type="number"
                  placeholder="1000"
                  {...form.register("weight")}
                  className="text-xs h-11 rounded-xl font-mono border-border/60"
                />
                <FieldDescription className="text-[10px]">
                  {t("weightHint")}
                </FieldDescription>
                <FieldError errors={[form.formState.errors.weight as any]} />
              </Field>
            </div>
          </div>

          {/* ── SEKSI 3: LOKASI PENGIRIMAN & DESKRIPSI ── */}
          <div className="bg-card border border-border/60 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/40 pb-2.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{t("sec3")}</span>
            </div>

            {/* Region Location Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProvinceSelect
                value={selectedProvince?.id}
                onSelect={(prov) => {
                  setSelectedProvince(prov);
                  form.setValue("province", prov.name);
                  setSelectedRegency(null);
                  form.setValue("city", "");
                }}
                error={form.formState.errors.province as any}
              />

              <RegencySelect
                provinceId={selectedProvince?.id}
                value={selectedRegency?.id}
                onSelect={(reg) => {
                  setSelectedRegency(reg);
                  form.setValue("city", reg.name);
                }}
                error={form.formState.errors.city as any}
              />
            </div>

            {/* Description Input */}
            <Field>
              <FieldLabel htmlFor="description" className="text-xs font-semibold text-foreground">
                {t("descriptionLabel")} <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="description"
                placeholder={t("descriptionPlaceholder")}
                {...form.register("description")}
                className="text-xs rounded-xl min-h-28 border-border/60 leading-relaxed"
              />
              <FieldError errors={[form.formState.errors.description as any]} />
            </Field>
          </div>

          {/* ── SEKSI 4: STATUS PUBLIKASI ── */}
          <div className="bg-card border border-border/60 p-5 rounded-2xl space-y-3">
            <Field>
              <FieldLabel className="text-xs font-semibold text-foreground">{t("sec4")}</FieldLabel>
              <RadioGroup
                value={form.watch("status") || "ACTIVE"}
                onValueChange={(val) => form.setValue("status", val, { shouldValidate: true, shouldDirty: true })}
                className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1 font-poppins"
              >
                <label className="flex items-center gap-2 text-xs cursor-pointer font-medium p-2.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-all flex-1">
                  <RadioGroupItem value="ACTIVE" id="status-active" />
                  <span className="font-semibold text-foreground">{t("statusActiveLabel")}</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer font-medium text-muted-foreground p-2.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-all flex-1">
                  <RadioGroupItem value="DRAFT" id="status-draft" />
                  <span>{t("statusDraftLabel")}</span>
                </label>
              </RadioGroup>
            </Field>
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <DialogFooter className="pt-3 gap-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 rounded-xl text-xs font-bold cursor-pointer"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 rounded-xl text-xs font-bold gap-2 cursor-pointer shadow-xs"
            >
              {isPending ? (
                t("submitting")
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {isEditing ? t("submitEdit") : t("submitCreate")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

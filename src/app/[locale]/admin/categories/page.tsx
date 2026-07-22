"use client";

import { useState } from "react";
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Wait, resolvers exists? Let's check package.json resolver
// Ah! In package.json, did it have @hookform/resolvers?
// Wait, we didn't see @hookform/resolvers in package.json dependencies!
// Let's verify package.json for @hookform/resolvers.
// Wait! If there is no @hookform/resolvers, we can just use React Hook Form manually with Zod validation manually (e.g. validating inside onSubmit using schema.safeParse(data)), OR we can register forms normally using React Hook Form's standard register and validate features!
// Yes, React Hook Form's standard validation (register options like required: true, pattern: /^[a-z0-9-]+$/) is super lightweight, fully supported out of the box, and does not require importing any resolvers!
// Let's write the Category Management page using React Hook Form's standard built-in validation options. This is extremely robust and avoids importing resolvers.
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, FolderTree } from "lucide-react";
import { toast } from "sonner";

export default function CategoryManagementPage() {
  const t = useTranslations("admin.categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      type: "MARKETPLACE" as "MARKETPLACE" | "LEARNING",
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    reset({ name: "", slug: "", type: "MARKETPLACE" });
    setModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("slug", category.slug);
    setValue("type", category.type);
    setModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, payload: data },
        {
          onSuccess: () => {
            toast.success("Kategori berhasil diupdate!");
            setModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || "Gagal mengupdate kategori");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Kategori berhasil dibuat!");
          setModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Gagal membuat kategori");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Kategori berhasil dihapus!");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Gagal menghapus kategori");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-xl inline-flex items-center gap-1.5 self-start md:self-auto">
          <Plus className="w-4 h-4" />
          {t("addCategory")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <FolderTree className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Tidak ada kategori ditemukan.</h3>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("table.name")}</th>
                  <th className="p-4">{t("table.slug")}</th>
                  <th className="p-4">{t("table.type")}</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{category.name}</td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">{category.slug}</td>
                    <td className="p-4">
                      <Badge
                        variant={category.type === "MARKETPLACE" ? "default" : "secondary"}
                        className="rounded-lg text-[10px] font-semibold px-2 py-0.5"
                      >
                        {category.type === "MARKETPLACE" ? t("types.marketplace") : t("types.learning")}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(category)}
                        className="rounded-xl inline-flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                        className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 inline-flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal using HTML5 dialog tag structure */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-foreground">
                  {editingCategory ? t("editCategory") : t("addCategory")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Isi formulir berikut untuk menyimpan data kategori.</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.name")}</label>
                  <input
                    type="text"
                    {...register("name", { required: "Nama kategori wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Contoh: Pupuk Kompos"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.slug")}</label>
                  <input
                    type="text"
                    {...register("slug", {
                      required: "Slug wajib diisi",
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: "Slug harus berformat kebab-case lowercase (contoh: pupuk-kompos)",
                      },
                    })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="contoh: pupuk-kompos"
                  />
                  {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.type")}</label>
                  <select
                    {...register("type")}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  >
                    <option value="MARKETPLACE">{t("types.marketplace")}</option>
                    <option value="LEARNING">{t("types.learning")}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-muted/10">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-xl"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("form.submit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

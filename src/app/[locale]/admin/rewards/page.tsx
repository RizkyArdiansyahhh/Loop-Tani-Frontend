"use client";

import { useState } from "react";
import { useAdminRewards, useCreateReward, useUpdateReward, useDeleteReward } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, Gift } from "lucide-react";
import { toast } from "sonner";

export default function RewardManagementPage() {
  const t = useTranslations("admin.rewards");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<any | null>(null);

  const { data: rewards, isLoading } = useAdminRewards();
  const createMutation = useCreateReward();
  const updateMutation = useUpdateReward();
  const deleteMutation = useDeleteReward();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      pointsCost: 500,
      isActive: true,
    },
  });

  const handleOpenCreate = () => {
    setEditingReward(null);
    reset({
      title: "",
      description: "",
      pointsCost: 500,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (reward: any) => {
    setEditingReward(reward);
    reset({
      title: reward.title,
      description: reward.description,
      pointsCost: reward.pointsCost,
      isActive: reward.isActive,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      pointsCost: Number(data.pointsCost),
    };

    if (editingReward) {
      updateMutation.mutate(
        { id: editingReward.id, payload },
        {
          onSuccess: () => {
            toast.success("Reward berhasil disimpan!");
            setModalOpen(false);
          },
          onError: () => {
            toast.error("Gagal mengupdate reward");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Reward berhasil dibuat!");
          setModalOpen(false);
        },
        onError: () => {
          toast.error("Gagal membuat reward");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus reward ini dari katalog?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Reward berhasil dihapus!");
        },
        onError: () => {
          toast.error("Gagal menghapus reward");
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
          {t("addReward")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !rewards || rewards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Gift className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Belum ada item penukaran poin.</h3>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("table.title")}</th>
                  <th className="p-4">{t("table.description")}</th>
                  <th className="p-4">{t("table.cost")}</th>
                  <th className="p-4">{t("table.status")}</th>
                  <th className="p-4 text-right">{t("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{reward.title}</td>
                    <td className="p-4 text-muted-foreground text-xs max-w-xs truncate">
                      {reward.description}
                    </td>
                    <td className="p-4 font-bold text-emerald-600">{reward.pointsCost} LP</td>
                    <td className="p-4">
                      <Badge
                        variant={reward.isActive ? "default" : "secondary"}
                        className="rounded-lg text-[10px] font-semibold px-2 py-0.5"
                      >
                        {reward.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(reward)}
                        className="rounded-xl inline-flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(reward.id)}
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

      {/* Add / Edit Modal using HTML5 dialog tag */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-foreground">
                  {editingReward ? t("editReward") : t("addReward")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Ubah atau isi katalog penukaran LoopPoints.</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.title")}</label>
                  <input
                    type="text"
                    {...register("title", { required: "Judul reward wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Contoh: Voucher Diskon Rp50.000"
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.description")}</label>
                  <textarea
                    rows={3}
                    {...register("description", { required: "Deskripsi wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Contoh: Potongan langsung belanja produk pertanian..."
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Points Cost */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">{t("form.pointsCost")}</label>
                    <input
                      type="number"
                      {...register("pointsCost", { required: "Biaya poin wajib diisi", min: 1 })}
                      className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    />
                  </div>

                  {/* Is Active */}
                  <div className="space-y-1.5 flex flex-col justify-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        {...register("isActive")}
                        className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-foreground">{t("form.isActive")}</span>
                    </label>
                  </div>
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

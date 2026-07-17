"use client";

import { useState } from "react";
import { useAdminKnowledge, useCreateKnowledge, useUpdateKnowledge, useDeleteKnowledge, useAdminCategories } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, BookOpen, Video, Eye } from "lucide-react";
import { toast } from "sonner";

export default function LearningManagementPage() {
  const t = useTranslations("admin.knowledge");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any | null>(null);
  const [videoSource, setVideoSource] = useState<"YOUTUBE" | "DIRECT">("YOUTUBE");

  const { data: contents, isLoading } = useAdminKnowledge();
  const { data: categories } = useAdminCategories();
  const createMutation = useCreateKnowledge();
  const updateMutation = useUpdateKnowledge();
  const deleteMutation = useDeleteKnowledge();

  const learningCategories = categories?.filter((c) => c.type === "LEARNING") ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "ARTICLE" as "ARTICLE" | "VIDEO",
      title: "",
      content: "",
      category: "",
      difficulty: "PEMULA" as "PEMULA" | "MENENGAH",
      imageUrl: "",
      rewardPoint: 20,
      estimatedReadingMinutes: 5,
      videoDuration: 0,
      secureUrl: "",
      thumbnailUrl: "",
    },
  });

  const contentType = watch("type");

  const handleOpenCreate = () => {
    setEditingContent(null);
    setVideoSource("YOUTUBE");
    reset({
      type: "ARTICLE",
      title: "",
      content: "",
      category: learningCategories[0]?.slug ?? "",
      difficulty: "PEMULA",
      imageUrl: "",
      rewardPoint: 20,
      estimatedReadingMinutes: 5,
      videoDuration: 0,
      secureUrl: "",
      thumbnailUrl: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (content: any) => {
    setEditingContent(content);
    const isYt = content.type === "VIDEO" && (!content.secureUrl || !content.secureUrl.startsWith("http"));
    setVideoSource(isYt ? "YOUTUBE" : "DIRECT");
    reset({
      type: content.type,
      title: content.title,
      content: content.content,
      category: content.category,
      difficulty: content.difficulty,
      imageUrl: content.imageUrl || "",
      rewardPoint: content.rewardPoint,
      estimatedReadingMinutes: content.estimatedReadingMinutes || 5,
      videoDuration: content.videoDuration || 0,
      secureUrl: content.secureUrl || "",
      thumbnailUrl: content.thumbnailUrl || "",
    });
    setModalOpen(true);
  };

  const onSubmit = (data: any) => {
    let finalThumbnail = data.thumbnailUrl || null;
    if (data.type === "VIDEO" && videoSource === "YOUTUBE" && !finalThumbnail && data.secureUrl) {
      finalThumbnail = `https://img.youtube.com/vi/${data.secureUrl}/hqdefault.jpg`;
    }

    // Cast points/durations to number
    const payload = {
      ...data,
      rewardPoint: Number(data.rewardPoint),
      estimatedReadingMinutes: data.type === "ARTICLE" ? Number(data.estimatedReadingMinutes) : null,
      videoDuration: data.type === "VIDEO" ? Number(data.videoDuration) : null,
      imageUrl: data.imageUrl || null,
      secureUrl: data.type === "VIDEO" ? data.secureUrl || null : null,
      thumbnailUrl: data.type === "VIDEO" ? finalThumbnail : null,
    };

    if (editingContent) {
      updateMutation.mutate(
        { id: editingContent.id, payload },
        {
          onSuccess: () => {
            toast.success("Konten edukasi berhasil disimpan");
            setModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || "Gagal mengupdate konten");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Konten edukasi berhasil dibuat");
          setModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Gagal membuat konten");
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus konten ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Konten berhasil dihapus");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Gagal menghapus konten");
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
          {t("addContent")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !contents || contents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Belum ada konten edukasi.</h3>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("table.title")}</th>
                  <th className="p-4">{t("table.type")}</th>
                  <th className="p-4">{t("table.category")}</th>
                  <th className="p-4">{t("table.points")}</th>
                  <th className="p-4">{t("table.author")}</th>
                  <th className="p-4 text-right">{t("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground max-w-xs md:max-w-md truncate">
                      {content.title}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1">
                        {content.type === "ARTICLE" ? (
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Video className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span className="text-xs font-semibold">{content.type}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="rounded-lg text-[10px] font-semibold px-2 py-0.5">
                        {content.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-foreground">{content.rewardPoint} LP</td>
                    <td className="p-4 text-muted-foreground text-xs">{content.author.name}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(content)}
                        className="rounded-xl inline-flex items-center gap-1 text-xs"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(content.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-2xl shadow-lg my-8 animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-foreground">
                  {editingContent ? t("editContent") : t("addContent")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Lengkapi data konten pembelajaran di bawah ini.</p>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">{t("form.type")}</label>
                    <select
                      {...register("type")}
                      className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    >
                      <option value="ARTICLE">Artikel</option>
                      <option value="VIDEO">Video</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">{t("form.category")}</label>
                    <select
                      {...register("category", { required: "Kategori wajib diisi" })}
                      className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    >
                      {learningCategories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.title")}</label>
                  <input
                    type="text"
                    {...register("title", { required: "Judul wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Contoh: Cara Membuat Briket Biomassa Jerami Padi"
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">{t("form.difficulty")}</label>
                    <select
                      {...register("difficulty")}
                      className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    >
                      <option value="PEMULA">{t("form.difficultyLabel.pemula")}</option>
                      <option value="MENENGAH">{t("form.difficultyLabel.menengah")}</option>
                    </select>
                  </div>

                  {/* Reward Point */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">{t("form.rewardPoint")}</label>
                    <input
                      type="number"
                      {...register("rewardPoint", { required: "Reward point wajib diisi", min: 1 })}
                      className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    />
                  </div>
                </div>

                {/* Cover Image URL */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.imageUrl")}</label>
                  <input
                    type="text"
                    {...register("imageUrl")}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Conditional Fields based on Article or Video */}
                {contentType === "ARTICLE" ? (
                  <div className="space-y-4">
                    {/* Est Reading Minutes */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">{t("form.estimatedMinutes")}</label>
                      <input
                        type="number"
                        {...register("estimatedReadingMinutes", { min: 1 })}
                        className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                      />
                    </div>
                  </div>
                                ) : (
                  <div className="space-y-4 p-4 bg-muted/20 border rounded-2xl">
                    {/* Video Source Type */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-semibold text-foreground">Sumber Video</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="videoSource"
                            checked={videoSource === "YOUTUBE"}
                            onChange={() => setVideoSource("YOUTUBE")}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                          <span className="text-sm font-medium text-foreground">YouTube Video ID</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="videoSource"
                            checked={videoSource === "DIRECT"}
                            onChange={() => setVideoSource("DIRECT")}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                          <span className="text-sm font-medium text-foreground">Unggah Mandiri (Cloudinary)</span>
                        </label>
                      </div>
                    </div>

                    {/* Video Duration (seconds) */}
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-semibold text-foreground">{t("form.videoDuration")}</label>
                      <input
                        type="number"
                        {...register("videoDuration", { min: 1 })}
                        className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                        placeholder="Dalam hitungan detik (contoh: 240)"
                      />
                    </div>

                    {videoSource === "YOUTUBE" ? (
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-sm font-semibold text-foreground">YouTube Video ID</label>
                        <input
                          type="text"
                          {...register("secureUrl", {
                            required: "YouTube Video ID wajib diisi",
                            maxLength: { value: 11, message: "YouTube Video ID biasanya sepanjang 11 karakter" },
                            minLength: { value: 11, message: "YouTube Video ID biasanya sepanjang 11 karakter" }
                          })}
                          className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                          placeholder="Contoh: ZKazVjP4Q1U"
                        />
                        {errors.secureUrl && <p className="text-xs text-red-500">{errors.secureUrl.message}</p>}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 col-span-2">
                        {/* Secure URL */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-foreground">{t("form.secureUrl")}</label>
                          <input
                            type="text"
                            {...register("secureUrl", { required: "URL Video wajib diisi jika tipe sumber Cloudinary" })}
                            className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                            placeholder="Contoh: https://res.cloudinary.com/..."
                          />
                          {errors.secureUrl && <p className="text-xs text-red-500">{errors.secureUrl.message}</p>}
                        </div>

                        {/* Thumbnail URL */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-foreground">{t("form.thumbnailUrl")}</label>
                          <input
                            type="text"
                            {...register("thumbnailUrl")}
                            className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                            placeholder="Contoh: https://res.cloudinary.com/..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Content main text */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">{t("form.content")}</label>
                  <textarea
                    rows={8}
                    {...register("content", { required: "Konten utama wajib diisi" })}
                    className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Tulis artikel lengkap di sini..."
                  />
                  {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
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

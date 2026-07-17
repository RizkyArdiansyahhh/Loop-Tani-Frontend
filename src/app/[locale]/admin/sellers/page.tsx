"use client";

import { useState } from "react";
import { useAdminSellers, useVerifySeller } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldAlert, CheckCircle2, XCircle, Store, X, Eye } from "lucide-react";
import { toast } from "sonner";

export default function SellerVerificationPage() {
  const t = useTranslations("admin.sellers");
  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");
  const [rejectingSeller, setRejectingSeller] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewingSeller, setViewingSeller] = useState<any | null>(null);

  const { data: sellers, isLoading, error } = useAdminSellers(selectedStatus as any);
  const verifySellerMutation = useVerifySeller();

  const handleApprove = (userId: string) => {
    verifySellerMutation.mutate(
      { userId, status: "ACTIVE" },
      {
        onSuccess: () => {
          toast.success("Seller berhasil disetujui!");
        },
        onError: () => {
          toast.error("Gagal menyetujui seller");
        },
      }
    );
  };

  const handleOpenReject = (seller: any) => {
    setRejectingSeller(seller);
    setRejectionReason("");
  };

  const handleReject = () => {
    if (!rejectingSeller) return;
    if (!rejectionReason.trim()) {
      toast.error(t("rejectionRequired"));
      return;
    }

    verifySellerMutation.mutate(
      { userId: rejectingSeller.userId, status: "REJECTED", rejectionReason },
      {
        onSuccess: () => {
          toast.success("Pendaftaran seller ditolak");
          setRejectingSeller(null);
        },
        onError: () => {
          toast.error("Gagal menolak seller");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-px">
        {["PENDING", "ACTIVE", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
              selectedStatus === status
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {status === "PENDING"
              ? "Toko Pending"
              : status === "ACTIVE"
              ? "Seller Aktif"
              : "Seller Ditolak"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-6 bg-red-50 text-red-800 rounded-2xl border border-red-200">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <span>Gagal memuat daftar seller.</span>
        </div>
      ) : !sellers || sellers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-2xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Store className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">{t("noPending")}</h3>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("storeName")}</th>
                  <th className="p-4">{t("owner")}</th>
                  <th className="p-4">{t("location")}</th>
                  <th className="p-4">{t("status")}</th>
                  <th className="p-4 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{seller.storeName}</div>
                      <div className="text-xs text-muted-foreground">@{seller.storeSlug}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-foreground">{seller.user.name}</div>
                      <div className="text-xs text-muted-foreground">{seller.user.email}</div>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {seller.province && seller.city ? `${seller.city}, ${seller.province}` : "-"}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          seller.status === "ACTIVE"
                            ? "default"
                            : seller.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                        className="rounded-lg text-[10px] font-semibold px-2 py-0.5"
                      >
                        {seller.status}
                      </Badge>
                      {seller.status === "REJECTED" && seller.rejectionReason && (
                        <div className="text-[10px] text-red-500 mt-1 max-w-[200px] truncate" title={seller.rejectionReason}>
                          Alasan: {seller.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingSeller(seller)}
                          className="rounded-xl inline-flex items-center gap-1.5 text-xs"
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                        {seller.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenReject(seller)}
                              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1.5 text-xs"
                            >
                              <XCircle className="h-4 w-4" />
                              {t("reject")}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(seller.userId)}
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5 text-xs"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              {t("approve")}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Reason Modal using HTML5 dialog tag */}
      {rejectingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-foreground">{t("rejectionTitle")}</h3>
              <p className="text-sm text-muted-foreground mt-1">Berikan alasan mengapa pendaftaran toko {rejectingSeller.storeName} ditolak.</p>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t("rejectionPlaceholder")}
                rows={4}
                className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/10">
              <Button variant="outline" onClick={() => setRejectingSeller(null)} className="rounded-xl">
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={verifySellerMutation.isPending}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                {verifySellerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Alasan & Tolak
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Seller Modal */}
      {viewingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-lg shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground">Detail Profil Toko</h3>
              <button onClick={() => setViewingSeller(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden border">
                  {viewingSeller.logoUrl ? (
                    <img src={viewingSeller.logoUrl} alt={viewingSeller.storeName} className="h-full w-full object-cover" />
                  ) : (
                    viewingSeller.storeName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">{viewingSeller.storeName}</h4>
                  <p className="text-xs text-muted-foreground">@{viewingSeller.storeSlug}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Pemilik Toko</span>
                  <span className="font-semibold text-foreground">{viewingSeller.user.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Email</span>
                  <span className="font-semibold text-foreground">{viewingSeller.user.email}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Nomor Telepon</span>
                  <span className="font-semibold text-foreground">{viewingSeller.phone || "-"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Pengajuan</span>
                  <span className="font-semibold text-foreground">
                    {new Date(viewingSeller.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Alamat Toko</span>
                  <span className="font-semibold text-foreground block leading-relaxed">
                    {viewingSeller.address || "-"}, {viewingSeller.city || "-"}, {viewingSeller.province || "-"} {viewingSeller.postalCode}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Deskripsi Toko</span>
                  <span className="text-muted-foreground text-xs block leading-relaxed italic bg-muted/30 p-3 rounded-xl border">
                    {viewingSeller.description || "Tidak ada deskripsi."}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/10">
              <Button variant="outline" onClick={() => setViewingSeller(null)} className="rounded-xl">
                Tutup
              </Button>
              {viewingSeller.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewingSeller(null);
                      handleOpenReject(viewingSeller);
                    }}
                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Tolak
                  </Button>
                  <Button
                    onClick={() => {
                      setViewingSeller(null);
                      handleApprove(viewingSeller.userId);
                    }}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Setujui
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

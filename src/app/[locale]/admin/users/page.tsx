"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateUserStatus, useUpdateUserRoles } from "@/features/admin/hooks/use-admin";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Edit2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const t = useTranslations("admin.users");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingRolesUser, setEditingRolesUser] = useState<any | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const { data: userResp, isLoading, error } = useAdminUsers(page, 10, search);
  const updateStatusMutation = useUpdateUserStatus();
  const updateRolesMutation = useUpdateUserRoles();

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateStatusMutation.mutate(
      { userId, isActive: !currentStatus },
      {
        onSuccess: () => {
          toast.success("Status pengguna berhasil diperbarui");
        },
        onError: () => {
          toast.error("Gagal memperbarui status pengguna");
        },
      }
    );
  };

  const handleOpenEditRoles = (user: any) => {
    setEditingRolesUser(user);
    setSelectedRoles(user.roles);
  };

  const handleToggleRoleSelection = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSaveRoles = () => {
    if (!editingRolesUser) return;
    updateRolesMutation.mutate(
      { userId: editingRolesUser.id, roles: selectedRoles },
      {
        onSuccess: () => {
          toast.success("Peran pengguna berhasil disimpan");
          setEditingRolesUser(null);
        },
        onError: () => {
          toast.error("Gagal memperbarui peran pengguna");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 rounded-2xl bg-card border shadow-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-6 bg-red-50 text-red-800 rounded-2xl border border-red-200">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <span>Gagal memuat daftar pengguna.</span>
        </div>
      ) : (
        <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b text-muted-foreground text-xs uppercase font-semibold">
                  <th className="p-4">{t("table.name")}</th>
                  <th className="p-4">{t("table.email")}</th>
                  <th className="p-4">{t("table.status")}</th>
                  <th className="p-4">{t("table.roles")}</th>
                  <th className="p-4 text-right">{t("table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {userResp?.data?.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium text-foreground">{user.name}</td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-xs transition-all ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {user.isActive ? t("status.active") : t("status.inactive")}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant={role === "ADMIN" ? "destructive" : role === "SELLER" ? "default" : "secondary"}
                            className="rounded-lg text-[10px] font-semibold px-2 py-0.5"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditRoles(user)}
                        className="rounded-xl inline-flex items-center gap-1.5 text-xs"
                      >
                        <Edit2 className="h-3 w-3" />
                        {t("changeRoles")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {userResp && userResp.meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Halaman {page} dari {userResp.meta.totalPages} (Total {userResp.meta.total} Pengguna)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl"
                >
                  Sebelumnya
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === userResp.meta.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Roles Modal using HTML5 dialog tag */}
      {editingRolesUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-foreground">Edit Peran Pengguna</h3>
              <p className="text-sm text-muted-foreground mt-1">Ubah hak akses sistem untuk {editingRolesUser.name}</p>
            </div>
            <div className="p-6 space-y-4">
              {["BUYER", "SELLER", "ADMIN"].map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/10 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleToggleRoleSelection(role)}
                    className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-sm text-foreground">{role}</span>
                    <p className="text-xs text-muted-foreground">
                      {role === "ADMIN"
                        ? "Hak akses penuh ke panel admin dan konfigurasi platform."
                        : role === "SELLER"
                        ? "Otoritas untuk mengelola produk dan berjualan di platform."
                        : "Pelanggan dasar untuk membeli produk dan membaca artikel."}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/10">
              <Button variant="outline" onClick={() => setEditingRolesUser(null)} className="rounded-xl">
                {t("cancel")}
              </Button>
              <Button onClick={handleSaveRoles} disabled={updateRolesMutation.isPending} className="rounded-xl">
                {updateRolesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("saveRoles")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

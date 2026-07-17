import { axiosInstance } from "@/lib/axios";
import { PaginatedResponse, UserProfile, SellerStatus } from "@/types/api";

export interface AdminDashboardData {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalProducts: number;
  totalArticles: number;
  totalVideos: number;
  totalPoints: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
  sellerProfile: {
    id: string;
    storeName: string;
    status: SellerStatus;
  } | null;
}

export interface AdminSeller {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postalCode: string | null;
  phone: string | null;
  logoUrl: string | null;
  status: SellerStatus;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  type: 'MARKETPLACE' | 'LEARNING';
  createdAt: string;
}

export interface AdminKnowledge {
  id: string;
  type: 'ARTICLE' | 'VIDEO';
  title: string;
  slug: string;
  content: string;
  category: string;
  difficulty: 'pemula' | 'menengah' | 'PEMULA' | 'MENENGAH';
  imageUrl: string | null;
  rewardPoint: number;
  estimatedReadingMinutes: number | null;
  videoDuration: number | null;
  cloudinaryPublicId: string | null;
  secureUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export interface AdminReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  content: string;
  isGlobal: boolean;
  userId: string | null;
  createdAt: string;
}

// ─── Dashboard API ─────────────────────────────────────────────────────────

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const { data } = await axiosInstance.get<AdminDashboardData>("/admin/dashboard");
  return data;
}

// ─── Users API ─────────────────────────────────────────────────────────────

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<PaginatedResponse<AdminUser>> {
  const params: Record<string, any> = { page, limit };
  if (search) params.search = search;
  const { data } = await axiosInstance.get<PaginatedResponse<AdminUser>>("/admin/users", { params });
  return data;
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<any> {
  const { data } = await axiosInstance.patch(`/admin/users/${userId}/status`, { isActive });
  return data;
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<any> {
  const { data } = await axiosInstance.patch(`/admin/users/${userId}/roles`, { roles });
  return data;
}

// ─── Sellers API ───────────────────────────────────────────────────────────

export async function getAdminSellers(status?: SellerStatus): Promise<AdminSeller[]> {
  const params: Record<string, any> = {};
  if (status) params.status = status;
  const { data } = await axiosInstance.get<AdminSeller[]>("/admin/sellers", { params });
  return data;
}

export async function verifySeller(
  userId: string,
  status: SellerStatus,
  rejectionReason?: string,
): Promise<AdminSeller> {
  const { data } = await axiosInstance.patch<AdminSeller>(`/admin/sellers/${userId}/verify`, {
    status,
    rejectionReason,
  });
  return data;
}

// ─── Categories API ────────────────────────────────────────────────────────

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const { data } = await axiosInstance.get<AdminCategory[]>("/admin/categories");
  return data;
}

export async function createCategory(payload: {
  name: string;
  slug: string;
  type: 'MARKETPLACE' | 'LEARNING';
}): Promise<AdminCategory> {
  const { data } = await axiosInstance.post<AdminCategory>("/admin/categories", payload);
  return data;
}

export async function updateCategory(
  id: string,
  payload: { name?: string; slug?: string; type?: 'MARKETPLACE' | 'LEARNING' },
): Promise<AdminCategory> {
  const { data } = await axiosInstance.patch<AdminCategory>(`/admin/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string): Promise<any> {
  const { data } = await axiosInstance.delete(`/admin/categories/${id}`);
  return data;
}

// ─── Knowledge API ─────────────────────────────────────────────────────────

export async function getAdminKnowledge(): Promise<AdminKnowledge[]> {
  const { data } = await axiosInstance.get<AdminKnowledge[]>("/admin/knowledge");
  return data;
}

export async function createKnowledge(payload: any): Promise<AdminKnowledge> {
  const { data } = await axiosInstance.post<AdminKnowledge>("/admin/knowledge", payload);
  return data;
}

export async function updateKnowledge(id: string, payload: any): Promise<AdminKnowledge> {
  const { data } = await axiosInstance.patch<AdminKnowledge>(`/admin/knowledge/${id}`, payload);
  return data;
}

export async function deleteKnowledge(id: string): Promise<any> {
  const { data } = await axiosInstance.delete(`/admin/knowledge/${id}`);
  return data;
}

// ─── Rewards API ───────────────────────────────────────────────────────────

export async function getAdminRewards(): Promise<AdminReward[]> {
  const { data } = await axiosInstance.get<AdminReward[]>("/admin/rewards");
  return data;
}

export async function createReward(payload: {
  title: string;
  description: string;
  pointsCost: number;
  isActive?: boolean;
}): Promise<AdminReward> {
  const { data } = await axiosInstance.post<AdminReward>("/admin/rewards", payload);
  return data;
}

export async function updateReward(
  id: string,
  payload: { title?: string; description?: string; pointsCost?: number; isActive?: boolean },
): Promise<AdminReward> {
  const { data } = await axiosInstance.patch<AdminReward>(`/admin/rewards/${id}`, payload);
  return data;
}

export async function deleteReward(id: string): Promise<any> {
  const { data } = await axiosInstance.delete(`/admin/rewards/${id}`);
  return data;
}

// ─── Notifications API ─────────────────────────────────────────────────────

export async function getAdminNotifications(): Promise<AdminNotification[]> {
  const { data } = await axiosInstance.get<AdminNotification[]>("/admin/notifications");
  return data;
}

export async function createNotification(payload: {
  title: string;
  content: string;
  isGlobal?: boolean;
  userId?: string;
}): Promise<AdminNotification> {
  const { data } = await axiosInstance.post<AdminNotification>("/admin/notifications", payload);
  return data;
}

// ─── Point Transactions API ────────────────────────────────────────────────

export interface AdminPointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARN' | 'REDEEM';
  description: string;
  sourceId: string | null;
  sourceType: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export async function getAdminPointTransactions(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<PaginatedResponse<AdminPointTransaction>> {
  const params: Record<string, any> = { page, limit };
  if (search) params.search = search;
  const { data } = await axiosInstance.get<PaginatedResponse<AdminPointTransaction>>("/admin/point-transactions", { params });
  return data;
}

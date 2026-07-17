import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-api";
import { adminKeys } from "../api/query-keys";
import { SellerStatus } from "@/types/api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: api.getAdminDashboard,
  });
}

export function useAdminUsers(page: number = 1, limit: number = 10, search?: string) {
  return useQuery({
    queryKey: adminKeys.users(page, search),
    queryFn: () => api.getAdminUsers(page, limit, search),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      api.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      api.updateUserRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useAdminSellers(status?: SellerStatus) {
  return useQuery({
    queryKey: adminKeys.sellers(status),
    queryFn: () => api.getAdminSellers(status),
  });
}

export function useVerifySeller() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
      rejectionReason,
    }: {
      userId: string;
      status: SellerStatus;
      rejectionReason?: string;
    }) => api.verifySeller(userId, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categories(),
    queryFn: api.getAdminCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
  });
}

export function useAdminKnowledge() {
  return useQuery({
    queryKey: adminKeys.knowledge(),
    queryFn: api.getAdminKnowledge,
  });
}

export function useCreateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.knowledge() });
    },
  });
}

export function useUpdateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.updateKnowledge(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.knowledge() });
    },
  });
}

export function useDeleteKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.knowledge() });
    },
  });
}

export function useAdminRewards() {
  return useQuery({
    queryKey: adminKeys.rewards(),
    queryFn: api.getAdminRewards,
  });
}

export function useCreateReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rewards() });
    },
  });
}

export function useUpdateReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.updateReward(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rewards() });
    },
  });
}

export function useDeleteReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rewards() });
    },
  });
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: adminKeys.notifications(),
    queryFn: api.getAdminNotifications,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.notifications() });
    },
  });
}

export function useAdminPointTransactions(page: number = 1, limit: number = 10, search?: string) {
  return useQuery({
    queryKey: adminKeys.pointTransactions(page, search),
    queryFn: () => api.getAdminPointTransactions(page, limit, search),
  });
}

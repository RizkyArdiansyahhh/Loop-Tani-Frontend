export const sellerKeys = {
  all: ['seller'] as const,
  me: () => [...sellerKeys.all, 'me'] as const,
  dashboard: () => [...sellerKeys.all, 'dashboard'] as const,
  store: (slug: string) => [...sellerKeys.all, 'store', slug] as const,
  orders: (params?: Record<string, any>) => [...sellerKeys.all, 'orders', params] as const,
  revenue: () => [...sellerKeys.all, 'revenue'] as const,
  analytics: (period?: string) => [...sellerKeys.all, 'analytics', period] as const,
  reviews: (rating?: number) => [...sellerKeys.all, 'reviews', rating] as const,
};

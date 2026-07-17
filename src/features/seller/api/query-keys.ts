export const sellerKeys = {
  all: ['seller'] as const,
  me: () => [...sellerKeys.all, 'me'] as const,
  dashboard: () => [...sellerKeys.all, 'dashboard'] as const,
  store: (slug: string) => [...sellerKeys.all, 'store', slug] as const,
};

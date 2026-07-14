export const sellerKeys = {
  all: ['seller'] as const,
  me: () => [...sellerKeys.all, 'me'] as const,
  dashboard: () => [...sellerKeys.all, 'dashboard'] as const,
};

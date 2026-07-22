export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  users: (page: number, search?: string) => [...adminKeys.all, "users", { page, search }] as const,
  sellers: (status?: string) => [...adminKeys.all, "sellers", { status }] as const,
  categories: () => [...adminKeys.all, "categories"] as const,
  knowledge: () => [...adminKeys.all, "knowledge"] as const,
  rewards: () => [...adminKeys.all, "rewards"] as const,
  notifications: () => [...adminKeys.all, "notifications"] as const,
  pointTransactions: (page: number, search?: string) => [...adminKeys.all, "pointTransactions", { page, search }] as const,
};

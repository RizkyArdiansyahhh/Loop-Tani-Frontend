export const panduanKeys = {
  all: ['panduan'] as const,
  contents: (filters?: any) => [...panduanKeys.all, 'contents', filters] as const,
  content: (idOrSlug: string) => [...panduanKeys.all, 'content', idOrSlug] as const,
  progress: (contentId: string) => [...panduanKeys.all, 'progress', contentId] as const,
  points: () => ['points', 'me'] as const,
  transactions: (page?: number) => ['points', 'transactions', page] as const,
};

export const panduanKeys = {
  all: ['panduan'] as const,
  contents: (filters?: any) => filters ? [...panduanKeys.all, 'contents', filters] as const : [...panduanKeys.all, 'contents'] as const,
  content: (idOrSlug: string) => [...panduanKeys.all, 'content', idOrSlug] as const,
  progress: (contentId: string) => [...panduanKeys.all, 'progress', contentId] as const,
  points: () => ['points', 'me'] as const,
  transactions: (page?: number) => page !== undefined ? ['points', 'transactions', page] as const : ['points', 'transactions'] as const,
  comments: (contentId: string, page?: number) => page !== undefined ? [...panduanKeys.all, 'comments', contentId, page] as const : [...panduanKeys.all, 'comments', contentId] as const,
};

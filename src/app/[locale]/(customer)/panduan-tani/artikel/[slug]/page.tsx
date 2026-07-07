import ArticleDetailPage from "@/features/panduan-tani/pages/article-detail-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}

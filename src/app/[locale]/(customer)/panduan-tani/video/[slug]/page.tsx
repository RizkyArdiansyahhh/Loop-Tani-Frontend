import VideoDetailPage from "@/features/panduan-tani/pages/video-detail-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <VideoDetailPage slug={slug} />;
}

import StorefrontPage from "@/features/seller/pages/storefront-page";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <StorefrontPage slug={slug} />;
}

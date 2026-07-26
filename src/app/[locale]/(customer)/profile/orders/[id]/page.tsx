import { OrderDetailPage } from "@/features/order/pages/order-detail-page";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}

import { axiosInstance } from "@/lib/axios";

export interface TopProductItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  totalSold: number;
  totalRevenue: number;
}

export interface AnalyticsChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SellerAnalyticsResponse {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  totalWasteKg: number;
  conversionRate: string;
  storeViews: number;
  topProducts: TopProductItem[];
  chartSeries: AnalyticsChartPoint[];
}

export async function getSellerAnalytics(period?: string): Promise<SellerAnalyticsResponse> {
  const { data } = await axiosInstance.get<SellerAnalyticsResponse>("/seller/analytics", {
    params: { period },
  });
  return data;
}

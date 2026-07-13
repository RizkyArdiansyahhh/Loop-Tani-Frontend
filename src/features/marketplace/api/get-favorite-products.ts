import { axiosInstance } from "@/lib/axios";
import type { GetProductsParams, PaginatedResponse, ProductSummary } from "@/types/api";

export async function getFavoriteProducts(
  params?: GetProductsParams
): Promise<PaginatedResponse<ProductSummary>> {
  const { data } = await axiosInstance.get<PaginatedResponse<ProductSummary>>(
    "/products/favorites",
    { params }
  );
  return data;
}

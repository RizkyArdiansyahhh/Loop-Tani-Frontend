import { axiosInstance } from "@/lib/axios";
import type { GetProductsParams, PaginatedResponse, ProductSummary } from "@/types/api";

export async function getProducts(
  params?: GetProductsParams
): Promise<PaginatedResponse<ProductSummary>> {
  const { data } = await axiosInstance.get<PaginatedResponse<ProductSummary>>(
    "/products",
    { params }
  );
  return data;
}

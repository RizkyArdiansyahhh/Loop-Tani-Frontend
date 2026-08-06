export type CategoryKey =
  | "agricultural-waste"
  | "processed-product"
  | "secondhand";

export const CATEGORY_KEY_MAP: Record<string, CategoryKey> = {
  // Slug format
  "agricultural-waste": "agricultural-waste",
  "processed-product": "processed-product",
  "secondhand": "secondhand",

  // Prisma Enum format (UPPERCASE with underscore from API)
  AGRICULTURAL_WASTE: "agricultural-waste",
  PROCESSED_PRODUCT: "processed-product",
  SECONDHAND: "secondhand",
  SECOND_HAND: "secondhand",

  // Indonesian label fallback
  "Limbah Pertanian": "agricultural-waste",
  "Produk Olahan": "processed-product",
  "Alat Secondhand": "secondhand",
};

export function getCategoryKey(
  rawCategory?: string | null
): CategoryKey | null {
  if (!rawCategory) return null;
  if (CATEGORY_KEY_MAP[rawCategory]) {
    return CATEGORY_KEY_MAP[rawCategory];
  }
  const normalized = rawCategory.toLowerCase().replace(/_/g, "-");
  if (CATEGORY_KEY_MAP[normalized]) {
    return CATEGORY_KEY_MAP[normalized];
  }
  if (normalized === "second-hand") return "secondhand";
  return null;
}

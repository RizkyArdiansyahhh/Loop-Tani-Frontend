// ─────────────────────────────────────────────
// Enums (mirror dari backend)
// ─────────────────────────────────────────────

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'ARCHIVED';
export type ProductCondition = 'NEW' | 'USED';
export type ProductSortBy =
  | 'recommended'
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc';

export type ProductCategory =
  | 'agricultural-waste'
  | 'processed-product'
  | 'secondhand';

// ─────────────────────────────────────────────
// Base Models
// ─────────────────────────────────────────────

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

export interface SellerSummary {
  id: string;
  name: string;
  image: string | null;
}

// ─────────────────────────────────────────────
// Product
// ─────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  condition: ProductCondition;
  status: ProductStatus;
  isFeatured: boolean;
  province: string | null;
  city: string | null;
  sellerRating: number;
  totalReview: number;
  category: ProductCategory;
  thumbnail: string | null;
  location: string | null;
  favoriteCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  seller: SellerSummary;
}

/** Product summary yang direturn pada list view */
export type ProductSummary = Product;

// ─────────────────────────────────────────────
// API Request / Response Types
// ─────────────────────────────────────────────

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  sort?: ProductSortBy;
  minPrice?: number;
  maxPrice?: number;
  province?: string;
  city?: string;
  minSellerRating?: number;
  favoriteOnly?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateProductImagePayload {
  imageUrl: string;
  order: number;
}

export interface CreateProductPayload {
  category: ProductCategory;
  title: string;
  description: string;
  price: number;
  stock: number;
  condition: ProductCondition;
  status?: ProductStatus;
  isFeatured?: boolean;
  province?: string;
  city?: string;
  images?: CreateProductImagePayload[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface CreateCategoryPayload {
  name: string;
  slug: string;
}

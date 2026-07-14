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

// ─────────────────────────────────────────────
// Cart Types
// ─────────────────────────────────────────────

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemProduct {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
  stock: number;
  weight: number;
  seller: {
    id: string;
    name: string;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  subtotal: number;
  isAvailable: boolean;
  availabilityReason: 'OUT_OF_STOCK' | 'ARCHIVED' | 'SOLD' | 'DRAFT' | null;
  createdAt: string;
  updatedAt: string;
  product: CartItemProduct;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  totalWeight: number;
}

export interface CartResponse {
  cart: Cart | null;
  items: CartItem[];
  summary: CartSummary;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// ─────────────────────────────────────────────
// User & Seller Profile Types
// ─────────────────────────────────────────────

export type SellerStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export interface UserSellerProfile {
  id: string;
  storeName: string;
  storeSlug: string;
  description: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postalCode: string | null;
  phone: string | null;
  logoUrl: string | null;
  status: SellerStatus;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  sellerProfile: {
    id: string;
    storeName: string;
    storeSlug: string;
    logoUrl: string | null;
    status: SellerStatus;
  } | null;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export interface RegisterSellerPayload {
  storeName: string;
  storeSlug: string;
  description?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
}

export interface SimulateApprovePayload {
  status: SellerStatus;
}

export interface RecentOrder {
  id: string;
  buyer: string;
  total: number;
  status: string;
  date: string;
}

export interface RecentReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface LowStockProduct {
  id: string;
  title: string;
  stock: number;
  price: number;
}

export interface SellerDashboardResponse {
  todayRevenue: number;
  monthlyRevenue: number;
  ordersCount: number;
  visitorsCount: number;
  conversionRate: string;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
  recentReviews: RecentReview[];
}

// ─────────────────────────────────────────────
// Knowledge Center & LoopPoints Gamification Types
// ─────────────────────────────────────────────

export type ContentType = 'ARTICLE' | 'VIDEO';
export type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';
export type ContentCategory = 'limbah' | 'olahan' | 'alat';
export type ContentDifficulty = 'pemula' | 'menengah';
export type PointTransactionType = 'EARN' | 'REDEEM';
export type PointTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Uploader {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
}

export interface LearningProgress {
  scrollPercentage: number;
  activeReadingSeconds: number;
  watchedPercentage: number;
  completed: boolean;
  rewardClaimed: boolean;
  completedAt: string | null;
}

export interface KnowledgeContent {
  id: string;
  slug: string;
  type: 'artikel' | 'video';
  title: string;
  content: string;
  category: ContentCategory;
  difficulty: ContentDifficulty;
  imageUrl: string | null;
  points: number;
  duration: string;
  youtubeId?: string;
  cloudinaryPublicId: string | null;
  secureUrl: string | null;
  thumbnailUrl: string | null;
  status: ContentStatus;
  createdAt: string;
  uploader: Uploader;
  progress?: LearningProgress | null;
  estimatedReadingMinutes?: number | null;
  videoDuration?: number | null;
}

export interface CompleteContentPayload {
  scrollPercentage?: number;
  activeReadingSeconds?: number;
  watchedPercentage?: number;
}

export interface CompleteContentResponse {
  completed: boolean;
  canClaim: boolean;
}

export interface ClaimRewardResponse {
  pointsEarned: number;
  totalPoints: number;
  tier: PointTier;
}

export interface UserPointAccount {
  id: string;
  userId: string;
  totalPoint: number;
  lifetimePoint: number;
  tier: PointTier;
  createdAt: string;
  updatedAt: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: PointTransactionType;
  description: string;
  sourceId: string | null;
  sourceType: string | null;
  createdAt: string;
}

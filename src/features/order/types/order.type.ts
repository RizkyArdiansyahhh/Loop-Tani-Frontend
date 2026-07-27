export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type CheckoutType = "BUY_NOW" | "CART";

export interface CreateOrderPayload {
  checkoutType: CheckoutType;
  addressId: string;
  productId?: string;
  quantity?: number;
  cartItemIds?: string[];
}

export interface OrderSellerSnapshot {
  sellerId: string;
  storeName: string;
  storeSlug: string;
  logoUrl: string | null;
}

export interface OrderAddressSnapshot {
  recipientName: string;
  recipientPhone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  subDistrictId: string;
  subDistrictName: string;
  postalCode: string;
  street: string;
  notes: string | null;
}

export interface OrderPricingSnapshot {
  subtotal: number;
  shippingCost: number;
  serviceFee: number;
  discount: number;
  insuranceFee: number;
  applicationFee: number;
  grandTotal: number;
  totalWeight: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnailUrl: string | null;
  productPrice: number;
  weight: number;
  quantity: number;
  subtotal: number;
  categoryId: string | null;
  categoryName: string | null;
  unit: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  seller: OrderSellerSnapshot;
  shippingAddress: OrderAddressSnapshot;
  pricing: OrderPricingSnapshot;
  orderStatus: OrderStatus;
  expiredAt: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  orders: Order[];
  totalOrders: number;
}

export interface OrderPaginatedResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetOrdersParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

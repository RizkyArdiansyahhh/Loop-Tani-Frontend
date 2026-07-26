export interface BuyNowCheckoutPayload {
  productId: string;
  quantity: number;
  addressId?: string;
}

export interface CartCheckoutPayload {
  cartItemIds: string[];
  addressId?: string;
}

export interface CheckoutAddress {
  id: string;
  recipientName: string;
  recipientPhone: string;
  fullAddress: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CheckoutItem {
  id: string;
  productId: string;
  productName: string;
  slug: string;
  image: string | null;
  price: number;
  weight: number;
  quantity: number;
  subtotal: number;
  sellerId: string;
  sellerName: string;
}

export interface CheckoutStore {
  sellerId: string;
  sellerName: string;
  storeSlug: string;
  items: CheckoutItem[];
  storeSubtotal: number;
  storeWeight: number;
}

export interface CheckoutShipping {
  courier: string | null;
  service: string | null;
  etd: string | null;
  cost: number;
}

export interface CheckoutPricing {
  subtotal: number;
  shippingCost: number;
  serviceFee: number;
  discount: number;
  insuranceFee: number;
  applicationFee: number;
  total: number;
}

export interface CheckoutResponse {
  address: CheckoutAddress | null;
  stores: CheckoutStore[];
  shipping: CheckoutShipping;
  pricing: CheckoutPricing;
}

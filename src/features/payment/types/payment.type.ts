export type PaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export interface PaymentAction {
  action: string; // "PRESENT_TO_CUSTOMER", "REDIRECT", "AUTH"
  method: string; // "GET", "POST"
  url?: string;
  url_type?: string;
  qr_code?: string;
}

export interface CreatePaymentRequestPayload {
  channelCode: string;
  channelProperties?: Record<string, string>;
}

export interface PaymentRequestResponse {
  paymentId: string;
  paymentRequestId: string;
  referenceId: string;
  paymentStatus: PaymentStatus;
  providerStatus: string;
  amount: number;
  channelCode: string;
  actions?: PaymentAction[];
  expiredAt: string | null;
}

export interface PaymentDetailResponse {
  id: string;
  orderId: string;
  provider: string;
  referenceId: string;
  paymentRequestId: string | null;
  paymentId: string | null;
  paymentMethod: string | null;
  providerCode: string | null;
  amount: number;
  status: PaymentStatus;
  failureReason: string | null;
  expiredAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentChannelOption {
  code: string;
  name: string;
  category: "VIRTUAL_ACCOUNT" | "QRIS" | "EWALLET" | "PAYLATER" | "CARDS";
  logoUrl?: string;
  description?: string;
}

export const PAYMENT_CHANNELS: PaymentChannelOption[] = [
  // Virtual Accounts
  { code: "ID_BCA", name: "BCA Virtual Account", category: "VIRTUAL_ACCOUNT", description: "BCA Transfer VA" },
  { code: "ID_BNI", name: "BNI Virtual Account", category: "VIRTUAL_ACCOUNT", description: "BNI Transfer VA" },
  { code: "ID_BRI", name: "BRI Virtual Account", category: "VIRTUAL_ACCOUNT", description: "BRIVA Transfer" },
  { code: "ID_MANDIRI", name: "Mandiri Virtual Account", category: "VIRTUAL_ACCOUNT", description: "Livin Mandiri / VA" },
  { code: "ID_PERMATA", name: "Permata Virtual Account", category: "VIRTUAL_ACCOUNT", description: "Permata Transfer VA" },
  { code: "ID_BSI", name: "BSI Virtual Account", category: "VIRTUAL_ACCOUNT", description: "BSI Transfer VA" },

  // QRIS
  { code: "QRIS", name: "QRIS", category: "QRIS", description: "GoPay, OVO, ShopeePay, BCA, All Bank" },

  // E-Wallets
  { code: "ID_OVO", name: "OVO", category: "EWALLET", description: "Instan via Aplikasi OVO" },
  { code: "ID_DANA", name: "DANA", category: "EWALLET", description: "Instan via Dompet DANA" },
  { code: "ID_SHOPEEPAY", name: "ShopeePay", category: "EWALLET", description: "Instan via ShopeePay" },
  { code: "ID_LINKAJA", name: "LinkAja", category: "EWALLET", description: "Instan via LinkAja" },

  // Paylater
  { code: "ID_KREDIVO", name: "Kredivo", category: "PAYLATER", description: "Bayar 30 Hari atau Cicilan" },
  { code: "ID_AKULAKU", name: "Akulaku PayLater", category: "PAYLATER", description: "Bayar Nanti / Cicilan" },
];

import { axiosInstance } from "@/lib/axios";

export interface SellerTransaction {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  type: "INCOME" | "WITHDRAWAL";
  amount: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  date: string;
}

export interface SellerBankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface SellerRevenueResponse {
  totalRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnTotal: number;
  bankAccount: SellerBankAccount;
  transactions: SellerTransaction[];
}

export async function getSellerRevenue(): Promise<SellerRevenueResponse> {
  const { data } = await axiosInstance.get<SellerRevenueResponse>("/seller/revenue");
  return data;
}

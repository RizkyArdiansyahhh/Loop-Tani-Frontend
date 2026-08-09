import { axiosInstance } from "@/lib/axios";

export interface RequestPayoutPayload {
  amount: number;
  bankName?: string;
  accountNumber?: string;
}

export interface RequestPayoutResponse {
  message: string;
  payout: {
    referenceNumber: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    status: string;
    requestedAt: string;
  };
}

export async function requestPayout(payload: RequestPayoutPayload): Promise<RequestPayoutResponse> {
  const { data } = await axiosInstance.post<RequestPayoutResponse>("/seller/revenue/withdraw", payload);
  return data;
}

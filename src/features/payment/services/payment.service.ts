import { axiosInstance } from "@/lib/axios";
import {
  CreatePaymentRequestPayload,
  PaymentRequestResponse,
  PaymentDetailResponse,
} from "../types/payment.type";

export const paymentService = {
  /**
   * Create Xendit Payment Request session for a Payment
   * POST /api/v1/payments/:id/create-request
   */
  createPaymentRequest: async (
    paymentId: string,
    payload: CreatePaymentRequestPayload,
  ): Promise<PaymentRequestResponse> => {
    const response = await axiosInstance.post<PaymentRequestResponse>(
      `/payments/${paymentId}/create-request`,
      payload,
    );
    return response.data;
  },

  /**
   * Fetch Payment detail by Payment ID
   * GET /api/v1/payments/:id
   */
  getPaymentById: async (paymentId: string): Promise<PaymentDetailResponse> => {
    const response = await axiosInstance.get<PaymentDetailResponse>(
      `/payments/${paymentId}`,
    );
    return response.data;
  },

  /**
   * Fetch Payment detail by Order ID
   * GET /api/v1/payments/order/:orderId
   */
  getPaymentByOrderId: async (orderId: string): Promise<PaymentDetailResponse> => {
    const response = await axiosInstance.get<PaymentDetailResponse>(
      `/payments/order/${orderId}`,
    );
    return response.data;
  },

  /**
   * Fetch Payment detail by Reference ID
   * GET /api/v1/payments/reference/:referenceId
   */
  getPaymentByReferenceId: async (
    referenceId: string,
  ): Promise<PaymentDetailResponse> => {
    const response = await axiosInstance.get<PaymentDetailResponse>(
      `/payments/reference/${referenceId}`,
    );
    return response.data;
  },
};

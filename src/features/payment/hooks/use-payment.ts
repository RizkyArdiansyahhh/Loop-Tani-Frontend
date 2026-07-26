import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";
import { CreatePaymentRequestPayload } from "../types/payment.type";

/**
 * Mutation hook to create or resume a Payment Request (v3 API)
 */
export function useCreatePaymentRequest() {
  return useMutation({
    mutationFn: ({
      paymentId,
      payload,
    }: {
      paymentId: string;
      payload: CreatePaymentRequestPayload;
    }) => paymentService.createPaymentRequest(paymentId, payload),
  });
}

/**
 * Query hook to fetch Payment detail by Order ID with automatic 3-second polling
 * when payment is in PENDING status.
 */
export function usePaymentByOrderId(
  orderId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ["payment", "order", orderId],
    queryFn: () => paymentService.getPaymentByOrderId(orderId!),
    enabled: Boolean(orderId) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Keep polling every 3 seconds while payment is PENDING
      if (status === "PENDING") {
        return 3000;
      }
      return false;
    },
  });
}

/**
 * Query hook to fetch Payment detail by Payment ID
 */
export function usePaymentById(paymentId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => paymentService.getPaymentById(paymentId!),
    enabled: Boolean(paymentId) && enabled,
  });
}

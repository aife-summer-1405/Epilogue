"use client";

import { toast } from "react-toastify";
import {
  deletePaymentAction,
  getPaymentByIdAction,
  getPaymentsAction,
  updatePaymentAction,
  verifyPaymentAction,
} from "@/app/actions/admin/payment.actions";
import {
  PaymentFilters,
  UpdatePaymentPayload,
  VerifyPaymentPayload,
} from "@/core/types/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

export function usePayments(filters: PaymentFilters) {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => getPaymentsAction(filters),
    placeholderData: (prev) => prev,
  });
}

export function usePaymentDetail(id: string | null) {
  return useQuery({
    queryKey: paymentKeys.detail(id || ""),
    queryFn: () => getPaymentByIdAction(id!),
    enabled: !!id,
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentPayload }) =>
      updatePaymentAction(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.id) });
      toast.success(`پرداخت #${variables.id} با موفقیت ویرایش شد.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ویرایش پرداخت");
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePaymentAction(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      toast.success(`پرداخت #${id} با موفقیت حذف شد.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف پرداخت");
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VerifyPaymentPayload }) =>
      verifyPaymentAction(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.id) });
      toast.success(`تراکنش #${variables.id} با موفقیت تایید شد.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در تایید تراکنش");
    },
  });
}
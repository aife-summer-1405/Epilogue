"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  approveSellerUpgradeRequestAction,
  getSellerUpgradeRequestsAction,
  rejectSellerUpgradeRequestAction,
} from "@/app/actions/admin/seller-upgrade.actions";
import type {
  ReviewSellerUpgradePayload,
  SellerUpgradeFilters,
} from "@/core/types/sellerUpgrade";

export const SELLER_UPGRADE_QUERY_KEY = ["admin-seller-upgrade-requests"];

export function useSellerUpgradeRequests(filters: SellerUpgradeFilters) {
  return useQuery({
    queryKey: [...SELLER_UPGRADE_QUERY_KEY, filters],
    queryFn: () => getSellerUpgradeRequestsAction(filters),
    placeholderData: (prev) => prev,
  });
}

export function useApproveSellerUpgradeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewSellerUpgradePayload) =>
      approveSellerUpgradeRequestAction(payload),
    onSuccess: () => {
      toast.success("درخواست ارتقا به فروشنده با موفقیت تایید شد.");
      queryClient.invalidateQueries({ queryKey: SELLER_UPGRADE_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در تایید درخواست فروشنده"
      );
    },
  });
}

export function useRejectSellerUpgradeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewSellerUpgradePayload) =>
      rejectSellerUpgradeRequestAction(payload),
    onSuccess: () => {
      toast.success("درخواست ارتقا به فروشنده رد شد.");
      queryClient.invalidateQueries({ queryKey: SELLER_UPGRADE_QUERY_KEY });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در رد درخواست فروشنده"
      );
    },
  });
}
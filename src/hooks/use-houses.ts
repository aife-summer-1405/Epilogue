"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteAdminHouseAction,
  getAdminHousesAction,
  updateAdminHouseAction,
} from "@/app/actions/admin/houses.action";
import { HouseFilters, UpdateHousePayload } from "@/core/types/house";

export const HOUSES_QUERY_KEY = ["admin-houses"];

export function useAdminHouses(filters: HouseFilters) {
  return useQuery({
    queryKey: [...HOUSES_QUERY_KEY, filters],
    queryFn: () => getAdminHousesAction(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateAdminHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHousePayload }) =>
      updateAdminHouseAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOUSES_QUERY_KEY });
      toast.success("اطلاعات اقامتگاه با موفقیت ویرایش شد");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در ثبت تغییرات اقامتگاه"
      );
    },
  });
}

export function useDeleteAdminHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminHouseAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOUSES_QUERY_KEY });
      toast.success("اقامتگاه با موفقیت حذف شد");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "خطا در حذف اقامتگاه");
    },
  });
}
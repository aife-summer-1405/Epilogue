import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createDiscountCodeAction,
  updateDiscountCodeAction,
  deleteDiscountCodeAction,
} from "@/app/actions/admin/discountCodes.actions";
import {
  ICreateDiscountCodePayload,
  IUpdateDiscountCodePayload,
} from "@/core/types/admin/discountCodes.types";
import { DISCOUNT_CODES_QUERY_KEY } from "@/hooks/queries/useGetDiscountCodes";

export const useCreateDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateDiscountCodePayload) =>
      createDiscountCodeAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در ایجاد کد تخفیف");
        return;
      }
      toast.success("کد تخفیف با موفقیت ایجاد شد.");
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_CODES_QUERY_KEY] });
    },
    onError: () => toast.error("خطا در برقراری ارتباط با سرور"),
  });
};

export const useUpdateDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateDiscountCodePayload) =>
      updateDiscountCodeAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در ویرایش کد تخفیف");
        return;
      }
      toast.success("کد تخفیف با موفقیت ویرایش شد.");
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_CODES_QUERY_KEY] });
    },
    onError: () => toast.error("خطا در برقراری ارتباط با سرور"),
  });
};

export const useDeleteDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteDiscountCodeAction(id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف کد تخفیف");
        return;
      }
      toast.success("کد تخفیف با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: [DISCOUNT_CODES_QUERY_KEY] });
    },
    onError: () => toast.error("خطا در برقراری ارتباط با سرور"),
  });
};
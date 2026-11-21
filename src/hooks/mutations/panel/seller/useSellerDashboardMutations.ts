import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  confirmSellerBookingAction,
  cancelSellerBookingAction,
  deleteSellerBookingAction,
} from "@/app/actions/panel/seller/sellerDashboard.actions";
import { SELLER_DASHBOARD_QUERY_KEY } from "@/hooks/queries/useGetSellerDashboard";

export const useConfirmSellerBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string | number) =>
      confirmSellerBookingAction(bookingId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در تایید رزرو");
        return;
      }
      toast.success("رزرو با موفقیت تایید شد.");
      queryClient.invalidateQueries({ queryKey: [SELLER_DASHBOARD_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};

export const useCancelSellerBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string | number) =>
      cancelSellerBookingAction(bookingId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در لغو رزرو");
        return;
      }
      toast.success("رزرو با موفقیت لغو شد.");
      queryClient.invalidateQueries({ queryKey: [SELLER_DASHBOARD_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};

export const useDeleteSellerBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string | number) =>
      deleteSellerBookingAction(bookingId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف رزرو");
        return;
      }
      toast.success("رزرو با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: [SELLER_DASHBOARD_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};
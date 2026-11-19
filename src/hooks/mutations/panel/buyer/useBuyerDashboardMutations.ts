import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBuyerBookingAction } from "@/app/actions/panel/buyer/buyerDashboard.actions";
import { BUYER_DASHBOARD_QUERY_KEY } from "@/hooks/queries/useGetBuyerDashboard";

export const useDeleteBuyerBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string | number) =>
      deleteBuyerBookingAction(bookingId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف رزرو");
        return;
      }
      toast.success("رزرو با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: [BUYER_DASHBOARD_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};
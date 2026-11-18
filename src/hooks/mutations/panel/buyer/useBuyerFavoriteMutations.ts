import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteBuyerFavoriteAction } from "@/app/actions/panel/buyer/buyerFavorites.actions";
import { BUYER_FAVORITES_QUERY_KEY } from "@/hooks/queries/useGetBuyerFavorites";

export const useDeleteBuyerFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId: string | number) =>
      deleteBuyerFavoriteAction(favoriteId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف از علاقه‌مندی‌ها");
        return;
      }
      toast.success("ملک از لیست علاقه‌مندی‌ها حذف شد.");
      queryClient.invalidateQueries({ queryKey: [BUYER_FAVORITES_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};
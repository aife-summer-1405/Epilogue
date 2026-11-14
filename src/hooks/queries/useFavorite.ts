import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavoriteAction, removeFavoriteAction } from "@/app/actions/Feedback.actions";
import { toast } from "react-toastify";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (payload: { user_id: string; house_id: string }) => addFavoriteAction(payload),
    onSuccess: () => {
      toast.success("با موفقیت به علاقه‌مندی‌ها اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["house"] });
    },
    onError: () => {
      toast.error("خطا در افزودن به علاقه‌مندی‌ها");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (favoriteId: string | number) => removeFavoriteAction(favoriteId),
    onSuccess: () => {
      toast.success("از علاقه‌مندی‌ها حذف شد");
      queryClient.invalidateQueries({ queryKey: ["house"] });
    },
    onError: () => {
      toast.error("خطا در حذف از علاقه‌مندی‌ها");
    },
  });

  return { addMutation, removeMutation };
};
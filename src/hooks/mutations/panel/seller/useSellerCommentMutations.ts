import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  replyToCommentAction,
  updateSellerCommentAction,
  deleteSellerCommentAction,
  ICreateReplyPayload,
  IUpdateCommentPayload,
} from "@/app/actions/panel/seller/sellerComments.actions";
import {
  SELLER_COMMENTS_QUERY_KEY,
  SELLER_COMMENT_DETAIL_QUERY_KEY,
} from "@/hooks/queries/useGetSellerComments";

export const useReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateReplyPayload) => replyToCommentAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در ثبت پاسخ");
        return;
      }
      toast.success("پاسخ شما با موفقیت ثبت شد.");
      queryClient.invalidateQueries({ queryKey: [SELLER_COMMENTS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};

export const useUpdateSellerComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateCommentPayload) =>
      updateSellerCommentAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در ویرایش نظر");
        return;
      }
      toast.success("نظر با موفقیت ویرایش شد.");
      queryClient.invalidateQueries({ queryKey: [SELLER_COMMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SELLER_COMMENT_DETAIL_QUERY_KEY],
      });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};

export const useDeleteSellerComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteSellerCommentAction(id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف نظر");
        return;
      }
      toast.success("نظر با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: [SELLER_COMMENTS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};